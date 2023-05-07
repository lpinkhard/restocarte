import React, {useEffect, useState} from "react";
import {View} from '@aws-amplify/ui-react';
import {Container, Header, Image} from "semantic-ui-react";
import {API, Auth, graphqlOperation, Storage} from "aws-amplify";
import {getRestaurant, listRestaurants} from "./graphql/queries";

const MainHeading = ( {isManager, restaurantId, loadRestaurant, contentReady} ) => {
    const [restaurant, setRestaurant] = useState(null);
    const [contentLoaded, setContentLoaded] = useState(false);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    useEffect(() => {
        loadRestaurant(restaurant);
        if (restaurant) {
            document.title = restaurant.name;
            if (restaurant.favicon) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = restaurant.favicon;
            }
        }
    }, [loadRestaurant, restaurant, contentLoaded]);

    useEffect(() => {
        contentReady(contentLoaded);
    }, [contentReady, contentLoaded]);

    async function fetchRestaurant() {
        if (isManager) {
            const user = await Auth.currentAuthenticatedUser();
            const variables = {
                filter: {
                    userId: {
                        eq: user.username
                    }
                },
                limit: 1
            };

            const apiData = await API.graphql({ query: listRestaurants, variables, authMode: "AMAZON_COGNITO_USER_POOLS" });
            const restaurantsFromAPI = apiData.data.listRestaurants.items;
            await Promise.all(
                restaurantsFromAPI.map(async (restaurant) => {
                    if (restaurant.logo) {
                        restaurant.logo = await Storage.get(restaurant.logo);
                    }
                    return restaurant;
                })
            );

            if (restaurantsFromAPI.length > 0) {
                setRestaurant(restaurantsFromAPI[0]);
                if (!restaurantsFromAPI[0].logo) {
                    setContentLoaded(true);
                }
            } else {
                setRestaurant(null);
                setContentLoaded(true);
            }

            return;
        }

        const { data } = await API.graphql(
            graphqlOperation(getRestaurant, { id: restaurantId })
        );

        const restaurantData = data.getRestaurant;
        setRestaurant(restaurantData);
        if (!restaurantData.logo) {
            setContentLoaded(true);
        }
    }

    function refresh() {
        window.location.reload();
    }

    function handleImageDone(event) {
        setContentLoaded(true);
    }

    return (
        <View className="MainHeading">
            <Container>
                {restaurant && (
                    <Header as="h1" textAlign="center" onClick={refresh}>
                        {restaurant.logo && (
                            <Image src={restaurant.logo} alt={restaurant.name} onLoad={handleImageDone.bind(this)} onError={handleImageDone.bind(this)} />
                        )}
                        {!restaurant.logo && (
                            <Header.Content>{restaurant.name}</Header.Content>
                        )}
                    </Header>
                )}
                {!restaurant && (
                    <Header as="h1" textAlign="center" onClick={refresh}>
                        {contentLoaded && (
                            <Image src="logo512.png" alt="Restocarte" />
                        )}
                    </Header>
                )}
                {restaurant && (
                    <Header as="h2" textAlign="center">
                        {!restaurant.tagline && (
                            <Header.Content>{restaurant.tagline}</Header.Content>
                        )}
                    </Header>
                )}
            </Container>
        </View>
    );
};

export default MainHeading;

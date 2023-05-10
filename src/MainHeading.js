import React, {useEffect, useState} from "react";
import {View} from '@aws-amplify/ui-react';
import {Container, Header, Image} from "semantic-ui-react";
import {API, Auth} from "aws-amplify";
import {getRestaurant, listRestaurants} from "./graphql/queries";
import {cdnPath} from "./Helpers";

const MainHeading = ( {isManager, restaurantId, loadRestaurant, contentReady, webp, displayTagline} ) => {
    const [restaurant, setRestaurant] = useState(null);
    const [contentLoaded, setContentLoaded] = useState(false);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    useEffect(() => {
        loadRestaurant(restaurant);
        updateFavicon();
    }, [loadRestaurant, restaurant, contentLoaded]);

    async function updateFavicon() {
        if (restaurant) {
            if (restaurant.name && restaurant.name.length > 0) {
                document.title = restaurant.name;
            }
            if (restaurant.favicon) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = cdnPath(restaurant.favicon);
            }
        }
    }

    useEffect(() => {
        contentReady(contentLoaded);
    }, [contentReady, contentLoaded]);

    async function isAuthenticated() {
        try {
            await Auth.currentAuthenticatedUser();
            return true;
        } catch {
            return false;
        }
    }

    async function fetchRestaurant() {
        if (isManager) {
            const user = await Auth.currentAuthenticatedUser();
            const variables = {
                filter: {
                    userId: {
                        eq: user.username
                    }
                }
            };

            const apiData = await API.graphql({ query: listRestaurants, variables, authMode: "AMAZON_COGNITO_USER_POOLS" });
            const restaurantsFromAPI = apiData.data.listRestaurants.items;
            await Promise.all(
                restaurantsFromAPI.map(async (restaurant) => {
                    if (restaurant.logo) {
                        if (webp) {
                            restaurant.logo = cdnPath(restaurant.logo + '.webp');
                        } else {
                            restaurant.logo = cdnPath(restaurant.logo + '.png');
                        }
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

        const { data } = await API.graphql({
                query: getRestaurant,
                variables: {id: restaurantId},
                authMode: await isAuthenticated() ? "AMAZON_COGNITO_USER_POOLS" : "AWS_IAM",
            });

        const restaurantData = data.getRestaurant;
        if (restaurantData.logo) {
            if (webp) {
                restaurantData.logo = cdnPath(restaurantData.logo + '.webp');
            } else {
                restaurantData.logo = cdnPath(restaurantData.logo + '.png');
            }
        }

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
            <Container fluid>
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
                        {contentLoaded && webp (
                            <Image src="logo.webp" alt="Restocarte" />
                        )}
                        {contentLoaded && !webp (
                            <Image src="logo.png" alt="Restocarte" />
                        )}
                    </Header>
                )}
                {restaurant && (
                    <View>
                        {displayTagline && (
                            <Header as="h2" textAlign="center">
                                {restaurant.tagline && (
                                    <Header.Content>{restaurant.tagline}</Header.Content>
                                )}
                            </Header>
                        )}
                    </View>
                )}
            </Container>
        </View>
    );
};

export default MainHeading;

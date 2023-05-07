import React, {useEffect, useState} from "react";
import {View} from '@aws-amplify/ui-react';
import {Header, Image} from "semantic-ui-react";
import {API, Auth, graphqlOperation, Storage} from "aws-amplify";
import {getRestaurant, listRestaurants} from "./graphql/queries";

const MainHeading = ( {isManager, restaurantId} ) => {
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        fetchRestaurant();
    }, []);

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
            }

            return;
        }

        const { data } = await API.graphql(
            graphqlOperation(getRestaurant, { id: restaurantId })
        );

        const restaurantData = data.getRestaurant;
        setRestaurant(restaurantData);
    }

    function refresh() {
        window.location.reload();
    }

    return (
        <View className="MainHeading">
            {restaurant && (
                <Header as="h1" textAlign="center" onClick={refresh}>
                    {restaurant.logo && (
                        <Image src={restaurant.logo} alt={restaurant.name} />
                    )}
                    {!restaurant.logo && (
                        <Header.Content>{restaurant.name}</Header.Content>
                    )}
                </Header>
            )}
            {!restaurant && (
                <Header as="h1" textAlign="center" onClick={refresh}>
                    <Image src="logo512.png" alt="Restocarte" />
                </Header>
            )}
            {restaurant && (
                <Header as="h2" textAlign="center">
                    {!restaurant.tagline && (
                        <Header.Content>{restaurant.tagline}</Header.Content>
                    )}
                </Header>
            )}
        </View>
    );
};

export default MainHeading;

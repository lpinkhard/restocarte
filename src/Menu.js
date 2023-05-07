import React, {useCallback, useEffect, useState} from "react";
import {View} from '@aws-amplify/ui-react';

import Categories from './Categories'
import MenuItems from './MenuItems'
import {API, Auth, graphqlOperation, Storage} from "aws-amplify";
import {getRestaurant, listRestaurants} from "./graphql/queries";

const Menu = ( {isManager, restaurantId} ) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [restaurant, setRestaurant] = useState(null);

    const loadCategory = useCallback(val => {
        setSelectedCategory(val);
    }, [setSelectedCategory]);

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

    function MenuContent(category) {
        if (selectedCategory) {
            return (
                <View className="MenuContent">
                    <MenuItems isManager={isManager} loadCategory={loadCategory} category={selectedCategory}/>
                </View>
            );
        }

        return (
            <View className="MenuContent">
                <Categories isManager={isManager} loadCategory={loadCategory} restaurant={restaurant} selectedCategory={selectedCategory} />
            </View>
        );
    }

    return <MenuContent category={selectedCategory} />
};

export default Menu;

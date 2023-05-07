import React, {useCallback, useEffect, useState} from "react";
import {Grid, TextAreaField, TextField, View, withAuthenticator} from '@aws-amplify/ui-react';

import MainHeading from "./MainHeading";
import ManagerMenu from "./ManagerMenu";
import {Button, Header} from "semantic-ui-react";
import {
    createRestaurant as createRestaurantMutation,
    updateRestaurant as updateRestaurantMutation
} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listRestaurants} from "./graphql/queries";

const Tags = () => {
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
        if (!val) {
            newRestaurant();
        }
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    }

    async function fetchRestaurant() {
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
                if (restaurant.favicon) {
                    restaurant.favicon = await Storage.get(restaurant.favicon);
                }
                return restaurant;
            })
        );

        if (restaurantsFromAPI.length > 0) {
            setRestaurant(restaurantsFromAPI[0]);
        }
    }

    async function newRestaurant() {
        const user = await Auth.currentAuthenticatedUser();
        const data = {
            userId: user.username,
        };
        await API.graphql({
            query: createRestaurantMutation,
            variables: { input: data },
        });
        await fetchRestaurant();
    }

    async function createTag(event) {
        event.preventDefault();
        const target = document.getElementById('createTagForm');
        const form = new FormData(target);
        const table = form.get("table");

        let link = window.location.protocol + '//' + window.location.host + '/' + restaurant.id;
        if (table && table.length > 0) {
            link += '/' + table;
        }
        console.log(link)

        target.reset();
    }

    return (
        <View className="Restaurant">
            <ManagerMenu />
            <MainHeading isManager loadRestaurant={restaurantLoaded} contentReady={onContentReady} />
            {contentReady && (
                <View>
                    <Header as="h2" textAlign="center">Create Tags</Header>
                    {restaurant && (
                        <Grid id="createTagForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                            <TextField
                                name="table"
                                placeholder="Table Number"
                                label="Table"
                                variation="quiet"
                                type="number"
                            />
                            <Button positive onClick={createTag}>
                                Create
                            </Button>
                        </Grid>
                    )}
                </View>
            )}
        </View>
    );
};

export default withAuthenticator(Tags, { hideSignUp: true });

import React, {useEffect, useState} from "react";
import {Grid, TextAreaField, TextField, View, withAuthenticator} from '@aws-amplify/ui-react';

import MainHeading from "./MainHeading";
import ManagerMenu from "./ManagerMenu";
import {Button} from "semantic-ui-react";
import {
    createRestaurant as createRestaurantMutation,
    updateRestaurant as updateRestaurantMutation
} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listRestaurants} from "./graphql/queries";

const RestaurantSetup = () => {
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        loadRestaurant();
    }, []);

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
                return restaurant;
            })
        );

        if (restaurantsFromAPI.length > 0) {
            setRestaurant(restaurantsFromAPI[0]);
        }
    }

    async function newRestaurant() {
        const user = await Auth.currentAuthenticatedUser();;
        const data = {
            userId: user.username,
        };
        await API.graphql({
            query: createRestaurantMutation,
            variables: { input: data },
        });
        await fetchRestaurant();
    }

    async function loadRestaurant() {
        await fetchRestaurant();
        if (!restaurant) {
            await newRestaurant();
        }
    }

    async function updateRestaurant(event) {
        event.preventDefault();
        const target = document.getElementById('editRestaurantForm');
        const form = new FormData(target);
        const image = form.get("image");
        const data = {
            id: restaurant.id,
            name: form.get("name"),
            tagline: form.get("tagline"),
        };
        if (image.name.length > 0) {
            const fileId = guid();
            await Storage.put(fileId, image);
            data.image = fileId;
        }
        await API.graphql({
            query: updateRestaurantMutation,
            variables: { input: data },
        });
        await fetchRestaurant();
        target.reset();
    }

    return (
        <View className="Restaurant">
            <ManagerMenu />
            <MainHeading />
            {restaurant && (
                <Grid id="editRestaurantForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                    <TextField
                        name="name"
                        placeholder="Restaurant Name"
                        label="Name"
                        variation="quiet"
                        defaultValue={restaurant.name}
                        required
                    />
                    <TextAreaField
                        name="tagline"
                        placeholder="Restaurant Tagline"
                        label="Tagline"
                        variation="quiet"
                        defaultValue={restaurant.tagline}
                    />
                    <TextField
                        name="image"
                        label="Logo"
                        variation="quiet"
                        type="file"
                    />
                    <Button positive onClick={updateRestaurant}>
                        Update
                    </Button>
                </Grid>
            )}
        </View>
    );
};

export default withAuthenticator(RestaurantSetup, { hideSignUp: true });

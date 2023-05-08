import React, {useCallback, useState} from "react";
import {Grid, SelectField, TextField, View, withAuthenticator} from '@aws-amplify/ui-react';

import MainHeading from "./MainHeading";
import ManagerMenu from "./ManagerMenu";
import {Button, Container, Header} from "semantic-ui-react";
import {
    createRestaurant as createRestaurantMutation,
    updateRestaurant as updateRestaurantMutation
} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listRestaurants} from "./graphql/queries";
import CurrencyList from 'currency-list';

const RestaurantSetup = () => {
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);
    const [ selectedCurrency, setSelectedCurrency ] = useState("USD");
    const [ busyUpdating, setBusyUpdating ] = useState(false);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
        if (!val) {
            newRestaurant();
        }
        if (val && val.currency && val.currency.length > 0) {
            setSelectedCurrency(val.currency);
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

    async function updateRestaurant(event) {
        event.preventDefault();

        setBusyUpdating(true);

        const target = document.getElementById('editRestaurantForm');
        const form = new FormData(target);
        const image = form.get("image");
        const favicon = form.get("favicon");
        const data = {
            id: restaurant.id,
            name: form.get("name"),
            tagline: form.get("tagline"),
        };
        if (image.name.length > 0) {
            const fileId = guid();
            await Storage.put(fileId, image);
            data.logo = fileId;
        }
        if (favicon.name.length > 0) {
            const fileId = guid();
            await Storage.put(fileId, favicon);
            data.favicon = fileId;
        }
        const currency = form.get("currency");
        if (currency) {
            data.currency = currency;
        }
        await API.graphql({
            query: updateRestaurantMutation,
            variables: { input: data },
        });
        await fetchRestaurant();
        target.reset();

        setBusyUpdating(false);
    }

    const currencies = Object.values(CurrencyList.getAll("en_US"));

    return (
        <View className="Restaurant">
            <ManagerMenu />
            <MainHeading isManager loadRestaurant={restaurantLoaded} contentReady={onContentReady} />
            {contentReady && (
                <View>
                    <Header as="h2" textAlign="center">Restaurant Setup</Header>
                    {restaurant && (
                        <Container>
                            <Grid id="editRestaurantForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                                <TextField
                                    name="name"
                                    placeholder="Restaurant Name"
                                    label="Name"
                                    descriptiveText="Name of the restaurant"
                                    defaultValue={restaurant.name}
                                    required
                                />
                                <TextField
                                    name="tagline"
                                    placeholder="Restaurant Tagline"
                                    label="Tagline"
                                    descriptiveText="Text displayed under headers"
                                    defaultValue={restaurant.tagline}
                                />
                                <SelectField
                                    name="currency"
                                    label="Currency"
                                    descriptiveText="Currency used for prices"
                                    defaultValue={selectedCurrency}
                                >
                                    {currencies.map((currency) => (
                                        <option key={currency.code} value={currency.code}>{currency.name}</option>
                                    ))}
                                </SelectField>
                                <TextField
                                    name="image"
                                    label="Logo"
                                    descriptiveText="Logo displayed in headers"
                                    type="file"
                                />
                                <TextField
                                    name="favicon"
                                    label="Favicon"
                                    descriptiveText="Browser icon used on all pages"
                                    type="file"
                                />
                                <Button primary onClick={updateRestaurant} disabled={busyUpdating}>
                                    Update
                                </Button>
                            </Grid>
                        </Container>
                    )}
                </View>
            )}
        </View>
    );
};

export default withAuthenticator(RestaurantSetup, { hideSignUp: true });

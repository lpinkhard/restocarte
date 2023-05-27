import React, {useCallback, useState} from "react";
import {CheckboxField, Grid, SelectField, TextField, View, withAuthenticator} from '@aws-amplify/ui-react';

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
import {cdnPath, guid, hasWebPSupport, resizeImageFile} from "./Helpers";
import {useTranslation} from "react-i18next";
import i18n from "i18next";

const RestaurantSetup = () => {
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);
    const [ selectedCurrency, setSelectedCurrency ] = useState("USD");
    const [ selectedSocialLogin, setSelectedSocialLogin ] = useState("none");
    const [ busyUpdating, setBusyUpdating ] = useState(false);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
        if (val && val.currency && val.currency.length > 0) {
            setSelectedCurrency(val.currency);
        }
        if (val && val.socialLogin && val.socialLogin.length > 0) {
            setSelectedSocialLogin(val.socialLogin);
        }
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    const { t } = useTranslation();

    async function fetchRestaurant() {
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
                    if (hasWebPSupport()) {
                        restaurant.logo = cdnPath(restaurant.logo + '.webp');
                    } else {
                        restaurant.logo = cdnPath(restaurant.logo + '.png');
                    }
                }
                if (restaurant.favicon) {
                    restaurant.favicon = cdnPath(restaurant.favicon);
                }
                return restaurant;
            })
        );

        if (restaurantsFromAPI.length > 0) {
            setRestaurant(restaurantsFromAPI[0]);
        }
    }

    async function updateRestaurant(event) {
        event.preventDefault();

        setBusyUpdating(true);

        const target = document.getElementById('editRestaurantForm');
        const form = new FormData(target);
        const image = form.get("image");
        const favicon = form.get("favicon");
        const data = {
            name: form.get("name"),
            tagline: form.get("tagline"),
            onlineOrders: form.get("online-orders") != null,
        };
        if (image.name.length > 0) {
            const fileId = guid();
            await Storage.put(fileId + '.png', await resizeImageFile(image, 'PNG'));
            await Storage.put(fileId + '.webp', await resizeImageFile(image, 'WEBP'));
            data.logo = fileId;
        }
        if (favicon.name.length > 0) {
            const fileId = guid();
            await Storage.put(fileId, favicon);
            data.favicon = fileId;
        }
        const currency = form.get("currency");
        if (currency && currency.length > 0) {
            data.currency = currency;
            setSelectedCurrency(currency);
        }
        const socialLogin = form.get("social-login");
        if (socialLogin && socialLogin.length > 0) {
            data.socialLogin = socialLogin;
            setSelectedSocialLogin(socialLogin);
        }

        if (restaurant) {
            data.id = restaurant.id;

            await API.graphql({
                query: updateRestaurantMutation,
                variables: { input: data },
            });
        } else {
            const user = await Auth.currentAuthenticatedUser();
            data.userId = user.username;

            await API.graphql({
                query: createRestaurantMutation,
                variables: { input: data },
            });
        }

        await fetchRestaurant();

        setBusyUpdating(false);
    }

    let currencyData;
    try {
        currencyData = CurrencyList.getAll(i18n.language.replace('-', '_'));
        if (!currencyData) {
            currencyData = CurrencyList.getAll('en_US');
        }
    } catch {
        currencyData = CurrencyList.getAll('en_US');
    }
    const currencies = Object.values(currencyData);

    return (
        <View className="Restaurant">
            <ManagerMenu />
            <MainHeading isManager loadRestaurant={restaurantLoaded} contentReady={onContentReady} />
            {contentReady && (
                <View>
                    <Header as="h2" textAlign="center">{t('restaurant-setup')}</Header>
                    {restaurant && (
                        <Container>
                            <Grid id="editRestaurantForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                                <TextField
                                    name="name"
                                    placeholder={t('restaurant-name')}
                                    label={t('name-label')}
                                    descriptiveText={t('name-description')}
                                    defaultValue={restaurant.name}
                                    required
                                />
                                <TextField
                                    name="tagline"
                                    placeholder={t('restaurant-tagline')}
                                    label={t('tagline-label')}
                                    descriptiveText={t('tagline-description')}
                                    defaultValue={restaurant.tagline}
                                />
                                <SelectField
                                    name="currency"
                                    label={t('currency-label')}
                                    descriptiveText={t('currency-description')}
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                >
                                    {currencies.map((currency) => (
                                        <option key={currency.code} value={currency.code}>{currency.name}</option>
                                    ))}
                                </SelectField>
                                <SelectField
                                    name="social-login"
                                    label={t('social-login-label')}
                                    descriptiveText={t('social-login-description')}
                                    value={selectedSocialLogin}
                                    onChange={(e) => setSelectedSocialLogin(e.target.value)}
                                >
                                    <option key="none" value="none">{t('social-none')}</option>
                                    <option key="facebook" value="facebook">{t('social-facebook')}</option>
                                </SelectField>
                                <TextField
                                    name="image"
                                    label={t('logo-label')}
                                    descriptiveText={t('logo-description')}
                                    type="file"
                                />
                                <TextField
                                    name="favicon"
                                    label={t('favicon-label')}
                                    descriptiveText={t('favicon-description')}
                                    type="file"
                                />
                                <CheckboxField
                                    label={t('online-orders')}
                                    name="online-orders"
                                    value="yes"
                                    defaultChecked={restaurant.onlineOrders}
                                />
                                <Button primary onClick={updateRestaurant} disabled={busyUpdating}>
                                    {t('update')}
                                </Button>
                            </Grid>
                        </Container>
                    )}
                    {!restaurant && (
                        <Container>
                            <Grid id="editRestaurantForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                                <TextField
                                    name="name"
                                    placeholder={t('restaurant-name')}
                                    label={t('name-label')}
                                    descriptiveText={t('name-label')}
                                    required
                                />
                                <TextField
                                    name="tagline"
                                    placeholder={t('restaurant-tagline')}
                                    label={t('tagline-label')}
                                    descriptiveText={t('tagline-description')}
                                />
                                <SelectField
                                    name="currency"
                                    label={t('currency-label')}
                                    descriptiveText={t('currency-description')}
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                >
                                    {currencies.map((currency) => (
                                        <option key={currency.code} value={currency.code}>{currency.name}</option>
                                    ))}
                                </SelectField>
                                <SelectField
                                    name="social-login"
                                    label={t('social-login-label')}
                                    descriptiveText={t('social-login-description')}
                                    value={selectedSocialLogin}
                                    onChange={(e) => setSelectedSocialLogin(e.target.value)}
                                >
                                    <option key="none" value="none">{t('social-none')}</option>
                                    <option key="facebook" value="facebook">{t('social-facebook')}</option>
                                </SelectField>
                                <TextField
                                    name="image"
                                    label={t('logo-label')}
                                    descriptiveText={t('logo-description')}
                                    type="file"
                                />
                                <TextField
                                    name="favicon"
                                    label={t('favicon-label')}
                                    descriptiveText={t('favicon-description')}
                                    type="file"
                                />
                                <CheckboxField
                                    label={t('online-orders')}
                                    name="online-orders"
                                    value="yes"
                                />
                                <Button primary onClick={updateRestaurant} disabled={busyUpdating}>
                                    {t('update')}
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

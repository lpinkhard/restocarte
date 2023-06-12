import React, {useEffect, useState} from "react";
import {View} from '@aws-amplify/ui-react';
import {Container, Header, Image} from "semantic-ui-react";
import {API, Auth} from "aws-amplify";
import {getRestaurant, listRestaurants} from "../graphql/queries";
import {cdnPath} from "./Helpers";

const MainHeading = ( {isManager, restaurantId, loadRestaurant, contentReady, webp, displayTagline, isMenu} ) => {
    const [restaurant, setRestaurant] = useState(null);
    const [contentLoaded, setContentLoaded] = useState(false);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    useEffect(() => {
        loadRestaurant(restaurant);
        updateDisplay();
    }, [loadRestaurant, restaurant, contentLoaded]);

    async function updateDisplay() {
        if (restaurant) {
            let globalStyle = document.getElementById('globalStyle');
            if (!globalStyle) {
                globalStyle = document.createElement('style');
                globalStyle.id = 'globalStyle';
                document.head.appendChild(globalStyle);
            }
            if (isMenu && restaurant.styleData && restaurant.styleData.length > 0) {
                try {
                    const styleData = JSON.parse(restaurant.styleData);
                    globalStyle.innerHTML = '';
                    if ('bgcolor' in styleData && styleData.bgcolor && styleData.bgcolor.length > 0) {
                        document.body.style.background = styleData.bgcolor;
                    }
                    if ('textcolor' in styleData && styleData.textcolor && styleData.textcolor.length > 0) {
                        document.body.style.color = styleData.textcolor;
                    }
                    if ('itembgcolor' in styleData && styleData.itembgcolor && styleData.itembgcolor.length > 0) {
                        globalStyle.innerHTML += '.ui.card { background-color: ' + styleData.itembgcolor + ' !important }';
                        globalStyle.innerHTML += '.ui.container.orderBar { color: ' + styleData.itembgcolor + ' !important }';
                    }
                    if ('itemtextcolor' in styleData && styleData.itembgcolor && styleData.itembgcolor.length > 0) {
                        globalStyle.innerHTML += '.ui.card { color: ' + styleData.itemtextcolor + ' !important }';
                        globalStyle.innerHTML += '.ui.container.orderBar { background-color: ' + styleData.itemtextcolor + ' !important }';
                    }
                } catch {
                }
            } else {
                document.body.style.background = "#ffffff";
                document.body.style.color = "#000000";
                globalStyle.innerHTML = '';
            }
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

    async function authenticatedUser() {
        try {
            return await Auth.currentAuthenticatedUser();
        } catch {
            return null;
        }
    }

    async function fetchRestaurant() {
        const user = await authenticatedUser();

        if (isManager && user) {
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
                authMode: user != null ? "AMAZON_COGNITO_USER_POOLS" : "AWS_IAM",
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
                        {(contentLoaded && webp) && (
                            <Image src="logo.webp" alt="Restocarte" />
                        )}
                        {(contentLoaded && !webp) && (
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

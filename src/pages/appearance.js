import React, {useCallback, useState} from "react";
import {Grid, TextField, View, withAuthenticator} from '@aws-amplify/ui-react';

import MainHeading from "../components/MainHeading";
import ManagerMenu from "../components/ManagerMenu";
import {Button, Container, Header, Modal} from "semantic-ui-react";
import {
    updateRestaurant as updateRestaurantMutation
} from "../graphql/mutations";
import {API, Auth} from "aws-amplify";
import {listRestaurants} from "../graphql/queries";
import {cdnPath} from "../components/Helpers";
import {useTranslation} from "next-i18next";
import {HexColorPicker} from "react-colorful";
import dynamic from "next/dynamic";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const Appearance = () => {
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);
    const [ busyUpdating, setBusyUpdating ] = useState(false);
    const [ colorModalActive, setColorModalActive ] = useState(false);
    const [ colorModalElement, setColorModalElement ] = useState(null);
    const [ backgroundColor, setBackgroundColor ] = useState('#ffffff');
    const [ itemBackgroundColor, setItemBackgroundColor ] = useState('#ffffff');
    const [ textColor, setTextColor ] = useState('#000000');
    const [ itemTextColor, setItemTextColor ] = useState('#000000');

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
        if (val && val.styleData && val.styleData.length > 0) {
            try {
                const styleData = JSON.parse(val.styleData);
                if ('bgcolor' in styleData) {
                    setBackgroundColor(styleData.bgcolor);
                }
                if ('itembgcolor' in styleData) {
                    setItemBackgroundColor(styleData.itembgcolor);
                }
                if ('textcolor' in styleData) {
                    setTextColor(styleData.textcolor);
                }
                if ('itemtextcolor' in styleData) {
                    setItemTextColor(styleData.itemtextcolor);
                }
            } catch {
            }
        }
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    const { t } = useTranslation();

    const webp = dynamic(
        () => import('../components/WebPSupport'),
        { ssr: false }
    );

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
                    if (webp) {
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

    async function updateAppearance(event) {
        event.preventDefault();

        setBusyUpdating(true);

        const target = document.getElementById('editAppearanceForm');
        const form = new FormData(target);
        const data = {
            id: restaurant.id,
        };

        let styleData = {};
        const bgcolor = form.get('background-color');
        if (bgcolor && bgcolor.length > 0) {
            styleData.bgcolor = bgcolor;
        }
        const itembgcolor = form.get('item-background-color');
        if (itembgcolor && itembgcolor.length > 0) {
            styleData.itembgcolor = itembgcolor;
        }
        const textcolor = form.get('text-color');
        if (textcolor && textcolor.length > 0) {
            styleData.textcolor = textcolor;
        }
        const itemtextcolor = form.get('item-text-color');
        if (itemtextcolor && itemtextcolor.length > 0) {
            styleData.itemtextcolor = itemtextcolor;
        }
        data.styleData = JSON.stringify(styleData);

        await API.graphql({
            query: updateRestaurantMutation,
            variables: { input: data },
        });

        await fetchRestaurant();

        setBusyUpdating(false);
    }

    function pickColor(event, elementName) {
        event.preventDefault();

        const element = document.getElementById(elementName);

        setColorModalElement(element);
        setColorModalActive(true);
    }

    function changeColor(newColor) {
        if (colorModalElement.id === 'background-color') {
            setBackgroundColor(newColor);
        } else if (colorModalElement.id === 'item-background-color') {
            setItemBackgroundColor(newColor);
        } else if (colorModalElement.id === 'text-color') {
            setTextColor(newColor);
        } else if (colorModalElement.id === 'item-text-color') {
            setItemTextColor(newColor);
        }
    }

    function getColor() {
        if (!colorModalElement) {
            return "#ffffff";
        }

        if (colorModalElement.id === 'background-color') {
            return backgroundColor;
        }
        if (colorModalElement.id === 'item-background-color') {
            return itemBackgroundColor;
        }
        if (colorModalElement.id === 'text-color') {
            return textColor;
        }
        if (colorModalElement.id === 'item-text-color') {
            return itemTextColor;
        }

        return "#ffffff";
    }

    function ColorModal() {
        const currentColor = getColor();

        return (
            <Modal size="tiny" open={colorModalActive}>
                <Modal.Content><HexColorPicker color={currentColor} onChange={(newColor) => changeColor(newColor)} /></Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => setColorModalActive(false)} disabled={busyUpdating}>
                        {t('close')}
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    const backgroundColorStyle = backgroundColor ? { backgroundColor: backgroundColor } : {};
    const itemBackgroundColorStyle = itemBackgroundColor ? { backgroundColor: itemBackgroundColor } : {};
    const textColorStyle = textColor ? { backgroundColor: textColor } : {};
    const itemTextColorStyle = itemTextColor ? { backgroundColor: itemTextColor } : {};

    return (
        <View className="Appearance">
            <ManagerMenu />
            <MainHeading isManager loadRestaurant={restaurantLoaded} contentReady={onContentReady} />
            {contentReady && (
                <View>
                    <Header as="h2" textAlign="center">{t('appearance')}</Header>
                    {restaurant && (
                        <Container>
                            <Grid id="editAppearanceForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                                <TextField
                                    id="background-color"
                                    name="background-color"
                                    placeholder="#ffffff"
                                    label={t('background-color-label')}
                                    descriptiveText={t('background-color-description')}
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    outerEndComponent={
                                        <Button icon className="colorButton" style={backgroundColorStyle} onClick={(event) => pickColor(event, 'background-color')}></Button>
                                    }
                                />
                                <TextField
                                    id="text-color"
                                    name="text-color"
                                    placeholder="#000000"
                                    label={t('text-color-label')}
                                    descriptiveText={t('text-color-description')}
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    outerEndComponent={
                                        <Button icon className="colorButton" style={textColorStyle} onClick={(event) => pickColor(event, 'text-color')}></Button>
                                    }
                                />
                                <TextField
                                    id="item-background-color"
                                    name="item-background-color"
                                    placeholder="#ffffff"
                                    label={t('item-background-color-label')}
                                    descriptiveText={t('item-background-color-description')}
                                    value={itemBackgroundColor}
                                    onChange={(e) => setItemBackgroundColor(e.target.value)}
                                    outerEndComponent={
                                        <Button icon className="colorButton" style={itemBackgroundColorStyle} onClick={(event) => pickColor(event, 'item-background-color')}></Button>
                                    }
                                />
                                <TextField
                                    id="item-text-color"
                                    name="item-text-color"
                                    placeholder="#000000"
                                    label={t('item-text-color-label')}
                                    descriptiveText={t('item-text-color-description')}
                                    value={itemTextColor}
                                    onChange={(e) => setItemTextColor(e.target.value)}
                                    outerEndComponent={
                                        <Button icon className="colorButton" style={itemTextColorStyle} onClick={(event) => pickColor(event, 'item-text-color')}></Button>
                                    }
                                />
                                <Button primary onClick={updateAppearance} disabled={busyUpdating}>
                                    {t('update')}
                                </Button>
                            </Grid>
                            <ColorModal />
                        </Container>
                    )}
                </View>
            )}
        </View>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
            ])),
        },
    }
}

export default withAuthenticator(Appearance, { hideSignUp: true });

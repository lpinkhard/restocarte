import {Text, View} from '@aws-amplify/ui-react';

import MainHeading from './MainHeading';
import Menu from './Menu';
import React, {useCallback, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {hasWebPSupport} from "./Helpers";
import {useTranslation} from "react-i18next";

const Present = () => {
    const { restaurantId } = useParams();
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    const {t} = useTranslation();

    const webp = hasWebPSupport();

    return ([
        <View className="Present">
            <MainHeading restaurantId={restaurantId} loadRestaurant={restaurantLoaded} contentReady={onContentReady} webp={webp} displayTagline isMenu />
            {contentReady && (
                <Menu restaurant={restaurant} webp={webp} />
            )}
        </View>,
        <Text fontSize="0.75rem" textAlign="center"><Link to="https://www.restocarte.com">{t('powered-by-restocarte')}</Link></Text>
    ]);
};

export default Present;

import {View} from '@aws-amplify/ui-react';

import MainHeading from './MainHeading';
import Menu from './Menu';
import React, {useCallback, useState} from "react";
import {useParams} from "react-router-dom";
import {hasWebPSupport} from "./Helpers";
import SocialAuth from "./SocialAuth";
import {Container} from "semantic-ui-react";

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

    const webp = hasWebPSupport();

    return (
        <View className="Present">
            <MainHeading restaurantId={restaurantId} loadRestaurant={restaurantLoaded} contentReady={onContentReady} webp={webp} displayTagline isMenu />
            {contentReady && (
                <Menu restaurant={restaurant} webp={webp} />
            )}
        </View>
    );
};

export default Present;

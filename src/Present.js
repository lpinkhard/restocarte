import {View} from '@aws-amplify/ui-react';

import MainHeading from './MainHeading';
import Menu from './Menu';
import React, {useCallback, useState} from "react";
import {useParams} from "react-router-dom";

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

    return (
        <View className="Present">
            <MainHeading restaurantId={restaurantId} loadRestaurant={restaurantLoaded} contentReady={onContentReady} />
            {contentReady && (
                <Menu restaurant={restaurant} />
            )}
        </View>
    );
};

export default Present;

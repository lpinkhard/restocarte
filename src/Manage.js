import React, {useCallback, useState} from "react";
import {View, withAuthenticator} from '@aws-amplify/ui-react';

import Menu from './Menu'
import MainHeading from "./MainHeading";
import ManagerMenu from "./ManagerMenu";

const Manage = () => {
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    return (
        <View className="Manage">
            <ManagerMenu />
            <MainHeading isManager loadRestaurant={restaurantLoaded} contentReady={onContentReady} />
            {contentReady && (
                <Menu isManager restaurant={restaurant} />
            )}
        </View>
    );
};

export default withAuthenticator(Manage, { hideSignUp: true });

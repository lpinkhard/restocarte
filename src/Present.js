import {View} from '@aws-amplify/ui-react';

import MainHeading from './MainHeading';
import Menu from './Menu';
import React from "react";
import {useParams} from "react-router-dom";

const Present = () => {
    const { restaurantId } = useParams();

    return (
        <View className="Present">
            <MainHeading restaurantId={restaurantId} />
            <Menu restaurantId={restaurantId} />
        </View>
    );
};

export default Present;

import {View} from '@aws-amplify/ui-react';

import MainHeading from './MainHeading';
import Menu from './Menu';
import React from "react";

const Present = () => {
    return (
        <View className="Present">
            <MainHeading />
            <Menu />
        </View>
    );
};

export default Present;

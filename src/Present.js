import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {View} from '@aws-amplify/ui-react';

import Menu from './Menu'
import React from "react";

const Present = () => {
    return (
        <View className="Present">
            <Menu />
        </View>
    );
};

export default Present;

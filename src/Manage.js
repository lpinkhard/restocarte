import React from "react";
import {View, withAuthenticator} from '@aws-amplify/ui-react';

import Menu from './Menu'
import MainHeading from "./MainHeading";
import ManagerMenu from "./ManagerMenu";

const Manage = () => {
    return (
        <View className="Manage">
            <ManagerMenu />
            <MainHeading />
            <Menu isManager />
        </View>
    );
};

export default withAuthenticator(Manage, { hideSignUp: true });

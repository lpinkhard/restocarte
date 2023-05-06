import React from "react";
import {Menu as NavMenu, MenuItem as NavMenuItem, View, withAuthenticator} from '@aws-amplify/ui-react';
import {Button, Container} from "semantic-ui-react";

import Menu from './Menu'
import MainHeading from "./MainHeading";

const Manage = ( {signOut} ) => {
    return (
        <View className="Manage">
            <NavMenu>
                <NavMenuItem onClick={signOut}>Sign Out</NavMenuItem>
            </NavMenu>
            <MainHeading />
            <Menu isManager />
        </View>
    );
};

export default withAuthenticator(Manage, { hideSignUp: true });

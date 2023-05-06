import React, {useEffect, useState} from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {Button, View, withAuthenticator} from '@aws-amplify/ui-react';

import Menu from './Menu'

const Manage = ( {signOut} ) => {
    return (
        <View className="Manage">
            <Menu isManager />
            <Button onClick={signOut}>Sign Out</Button>
        </View>
    );
};

export default withAuthenticator(Manage, { hideSignUp: true });

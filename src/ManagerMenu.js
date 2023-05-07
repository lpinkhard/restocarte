import React from "react";
import {Divider, Menu as NavMenu, MenuItem as NavMenuItem, View, withAuthenticator} from '@aws-amplify/ui-react';
import {Link} from "react-router-dom";

const ManagerMenu = ( {signOut} ) => {
    return (
        <View className="ManagerMenu">
            <NavMenu>
                <NavMenuItem><Link to="/manage">Manage Menu</Link></NavMenuItem>
                <NavMenuItem><Link to="/tags">Create Tags</Link></NavMenuItem>
                <Divider />
                <NavMenuItem><Link to="/restaurant-setup">Restaurant Setup</Link></NavMenuItem>
                <Divider />
                <NavMenuItem onClick={signOut}><Link to="#">Sign Out</Link></NavMenuItem>
            </NavMenu>
        </View>
    );
};

export default withAuthenticator(ManagerMenu, { hideSignUp: true });

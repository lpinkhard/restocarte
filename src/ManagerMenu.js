import React from "react";
import {Divider, Menu as NavMenu, MenuItem as NavMenuItem, View, withAuthenticator} from '@aws-amplify/ui-react';
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ManagerMenu = ( {signOut} ) => {
    const { t } = useTranslation();

    return (
        <View className="ManagerMenu">
            <NavMenu>
                <NavMenuItem><Link to="/manage">{t('manage-menu')}</Link></NavMenuItem>
                <NavMenuItem><Link to="/tags">{t('create-tags')}</Link></NavMenuItem>
                <Divider />
                <NavMenuItem><Link to="/restaurant-setup">{t('restaurant-setup')}</Link></NavMenuItem>
                <NavMenuItem><Link to="/appearance">{t('appearance')}</Link></NavMenuItem>
                <Divider />
                <NavMenuItem><Link to={process.env.REACT_APP_CUSTOMER_PORTAL_URL}>{t('manage-subscription')}</Link></NavMenuItem>
                <NavMenuItem onClick={signOut}><Link to="#">{t('sign-out')}</Link></NavMenuItem>
            </NavMenu>
        </View>
    );
};

export default withAuthenticator(ManagerMenu, { hideSignUp: true });

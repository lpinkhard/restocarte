import React from "react";
import { Divider, Menu as NavMenu, MenuItem as NavMenuItem, View, withAuthenticator } from '@aws-amplify/ui-react';
import { useTranslation} from "next-i18next";

const ManagerMenu = ( {signOut} ) => {
    const { t } = useTranslation();

    return (
        <View className="ManagerMenu">
            <NavMenu>
                <NavMenuItem><a href="/manage">{t('manage-menu')}</a></NavMenuItem>
                <NavMenuItem><a href="/tags">{t('create-tags')}</a></NavMenuItem>
                <Divider />
                <NavMenuItem><a href="/restaurant-setup">{t('restaurant-setup')}</a></NavMenuItem>
                <NavMenuItem><a href="/appearance">{t('appearance')}</a></NavMenuItem>
                <Divider />
                <NavMenuItem><a href={process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL}>{t('manage-subscription')}</a></NavMenuItem>
                <NavMenuItem onClick={signOut}><a href="#">{t('sign-out')}</a></NavMenuItem>
            </NavMenu>
        </View>
    );
};

export default withAuthenticator(ManagerMenu, { hideSignUp: true });

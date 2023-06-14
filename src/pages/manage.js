import React, {useCallback, useState} from "react";
import {View, withAuthenticator} from '@aws-amplify/ui-react';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

import dynamic from "next/dynamic";
import Menu from '../components/Menu'
import MainHeading from "../components/MainHeading";
import ManagerMenu from "../components/ManagerMenu";

const Manage = () => {
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    const webp = dynamic(
        () => import('../components/WebPSupport'),
        { ssr: false }
    );

    return (
        <View className="Manage">
            <ManagerMenu />
            <MainHeading isManager loadRestaurant={restaurantLoaded} contentReady={onContentReady} webp={webp} isMenu />
            {contentReady && (
                <Menu isManager restaurant={restaurant} webp={webp} />
            )}
        </View>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
            ])),
        },
    }
}

export default withAuthenticator(Manage, { hideSignUp: true });

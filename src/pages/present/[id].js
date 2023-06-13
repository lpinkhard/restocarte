import {Text, View} from '@aws-amplify/ui-react';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
import MainHeading from '../../components/MainHeading';
import Menu from '../../components/Menu';
import React, {useCallback, useState} from "react";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const Present = () => {
    const router = useRouter();
    const idSplit = router.query.id.split('-');
    const restaurantId = idSplit.length >= 5 ? idSplit[0] + '-' + idSplit[1] + '-' + idSplit[2] + '-' + idSplit[3] + '-' + idSplit[4] : '';
    const tableId = idSplit.length >= 6 ? idSplit[5] : '';
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    const {t} = useTranslation();

    const webp = dynamic(
        () => import('../../components/WebPSupport'),
        { ssr: false }
    );

    return ([
        <View className="Present">
            <MainHeading restaurantId={restaurantId} loadRestaurant={restaurantLoaded} contentReady={onContentReady} webp={webp} displayTagline isMenu />
            {contentReady && (
                <Menu restaurant={restaurant} tableId={tableId} webp={webp} />
            )}
        </View>,
        <Text fontSize="0.75rem" textAlign="center"><a href="https://www.restocarte.com">{t('powered-by-restocarte')}</a></Text>
    ]);
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

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export default Present;

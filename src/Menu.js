import React, {Suspense, useCallback, useEffect, useState} from "react";

import CurrencyList from "currency-list";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import {Container} from "semantic-ui-react";

const Categories = React.lazy(() => import('./Categories'));
const MenuItems = React.lazy(() => import('./MenuItems'));
const SocialAuth = React.lazy(() => import('./SocialAuth'));

const Menu = ( {isManager, restaurant, webp} ) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceStep, setPriceStep] = useState(0.01);
    const [decimals, setDecimals] = useState(2);
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [authorizedState, setAuthorizedState] = useState(false);

    const loadCategory = useCallback(val => {
        setSelectedCategory(val);
    }, [setSelectedCategory]);

    const {t} = useTranslation();

    useEffect(() => {
        loadCurrency();
    }, [restaurant]);

    function loadCurrency() {
        let currencyCode = 'USD';
        if (restaurant) {
            currencyCode = restaurant.currency;
        }

        let currencyData, decimal_digits, symbol;
        try {
            currencyData = CurrencyList.get(currencyCode, i18n.language);
            if (!currencyData) {
                currencyData = CurrencyList.get(currencyCode);
            }
        } catch {
            currencyData = CurrencyList.get(currencyCode);
        }
        if (currencyData) {
            decimal_digits = currencyData.decimal_digits;
            symbol = currencyData.symbol;
        } else {
            decimal_digits = 2;
            symbol = "";
        }

        setDecimals(decimal_digits);
        setPriceStep(1.0 / Math.pow(10, decimal_digits));
        setCurrencySymbol(symbol);
    }

    function MenuContent(category) {
        const socialLogin = !isManager && restaurant.socialLogin && restaurant.socialLogin !== 'none';

        if (selectedCategory) {
            return (
                <Suspense fallback={<div className="LoadingDisplay">{t('loading')}</div>}>
                    {socialLogin && (
                        <Container className="socialContainer"><SocialAuth restaurant={restaurant} /></Container>
                    )}
                    <MenuItems isManager={isManager} loadCategory={loadCategory} category={selectedCategory} decimals={decimals} priceStep={priceStep} currencySymbol={currencySymbol} webp={webp} />
                </Suspense>
            );
        }

        return (
            <Suspense fallback={<div className="LoadingDisplay">{t('loading')}</div>}>
                {socialLogin && (
                    <Container className="socialContainer"><SocialAuth restaurant={restaurant} /></Container>
                )}
                <Categories isManager={isManager} loadCategory={loadCategory} restaurant={restaurant} selectedCategory={selectedCategory} webp={webp}/>
            </Suspense>
        );
    }

    return <MenuContent category={selectedCategory} />
};

export default Menu;

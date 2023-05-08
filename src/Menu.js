import React, {useCallback, useEffect, useState} from "react";
import {View} from '@aws-amplify/ui-react';

import Categories from './Categories'
import MenuItems from './MenuItems'
import CurrencyList from "currency-list";

const Menu = ( {isManager, restaurant} ) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceStep, setPriceStep] = useState(0.01);
    const [decimals, setDecimals] = useState(2);
    const [currencySymbol, setCurrencySymbol] = useState('$');

    const loadCategory = useCallback(val => {
        setSelectedCategory(val);
    }, [setSelectedCategory]);

    useEffect(() => {
        loadCurrency();
    }, [restaurant]);

    function loadCurrency() {
        let currencyCode = 'USD';
        if (restaurant) {
            currencyCode = restaurant.currency;
        }
        const { decimal_digits, symbol } = CurrencyList.get(currencyCode);
        setDecimals(decimal_digits);
        setPriceStep(1.0 / Math.pow(10, decimal_digits));
        setCurrencySymbol(symbol);
    }

    function MenuContent(category) {
        if (selectedCategory) {
            return (
                <View className="MenuContent">
                    <MenuItems isManager={isManager} loadCategory={loadCategory} category={selectedCategory} decimals={decimals} priceStep={priceStep} currencySymbol={currencySymbol} />
                </View>
            );
        }

        return (
            <View className="MenuContent">
                <Categories isManager={isManager} loadCategory={loadCategory} restaurant={restaurant} selectedCategory={selectedCategory} />
            </View>
        );
    }

    return <MenuContent category={selectedCategory} />
};

export default Menu;

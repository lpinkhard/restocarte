import React, {Suspense, useCallback, useEffect, useState} from "react";

import CurrencyList from "currency-list";

const Categories = React.lazy(() => import('./Categories'));
const MenuItems = React.lazy(() => import('./MenuItems'));

const Menu = ( {isManager, restaurant, webp} ) => {
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
                <Suspense fallback={<div className="LoadingDisplay">Loading...</div>}>
                    <MenuItems isManager={isManager} loadCategory={loadCategory} category={selectedCategory} decimals={decimals} priceStep={priceStep} currencySymbol={currencySymbol} webp={webp} />
                </Suspense>
            );
        }

        return (
            <Suspense fallback={<div className="LoadingDisplay">Loading...</div>}>
                <Categories isManager={isManager} loadCategory={loadCategory} restaurant={restaurant} selectedCategory={selectedCategory} webp={webp}/>
            </Suspense>
        );
    }

    return <MenuContent category={selectedCategory} />
};

export default Menu;

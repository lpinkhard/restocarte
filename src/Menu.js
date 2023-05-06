import React, {useCallback, useState} from "react";
import {Heading, Text, View} from '@aws-amplify/ui-react';

import Categories from './Categories'
import MenuItems from './MenuItems'

const Menu = ( {isManager, signOut} ) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const loadCategory = useCallback(val => {
        setSelectedCategory(val);
    }, [setSelectedCategory]);

    function MenuContent(category) {
        if (selectedCategory) {
            return (
                <View className="MenuContent">
                    <MenuItems isManager={isManager} loadCategory={loadCategory} category={selectedCategory}/>
                </View>
            );
        }

        return (
            <View className="MenuContent">
                <Categories isManager={isManager} loadCategory={loadCategory} selectedCategory={selectedCategory} />
            </View>
        );
    }

    return <MenuContent category={selectedCategory} />
};

export default Menu;

import React from "react";
import {View} from '@aws-amplify/ui-react';
import {Header, Image} from "semantic-ui-react";

const MainHeading = () => {
    function refresh() {
        window.location.reload();
    }

    return (
        <View className="MainHeading">
            <Header as="h1" textAlign="center" onClick={refresh}>
                <Image src="logo512.png" alt="Restocarte" />
            </Header>
        </View>
    );
};

export default MainHeading;

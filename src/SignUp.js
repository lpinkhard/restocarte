import React from 'react';
import Menu from "./Menu";
import {View} from "@aws-amplify/ui-react";
import Subscribe from './Subscribe';

const SignUp = () => {
    return (
        <View className="SignUp">
            Standard: <Subscribe plan={0} />
            Advanced: <Subscribe plan={1} />
        </View>
    );
};

export default SignUp;
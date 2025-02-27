import React from "react";
import SocialLogin from "react-social-login";
import {Button} from "semantic-ui-react";

class SocialButton extends React.Component {
    render() {
        const { children, triggerLogin, ...props } = this.props;
        return (
            <Button primary onClick={triggerLogin} {...props}>
                {children}
            </Button>
        );
    }
}

export default SocialLogin(SocialButton);
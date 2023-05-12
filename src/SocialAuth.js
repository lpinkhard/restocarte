import React, { Component } from 'react'

import SocialButton from './SocialButton'
//import {Button} from "semantic-ui-react";
import {withTranslation} from "react-i18next";

class SocialAuth extends Component {
    constructor (props) {
        super(props)

        this.state = {
            logged: false,
            user: {},
            currentProvider: ''
        }
        this.nodes = {}

        this.onLoginSuccess = this.onLoginSuccess.bind(this)
        this.onLoginFailure = this.onLoginFailure.bind(this)
        this.onLogoutSuccess = this.onLogoutSuccess.bind(this)
        this.onLogoutFailure = this.onLogoutFailure.bind(this)
        this.logout = this.logout.bind(this)
    }

    setNodeRef (provider, node) {
        if (node) {
            this.nodes[ provider ] = node
        }
    }

    onLoginSuccess (user) {
        console.log(user)

        this.setState({
            logged: true,
            currentProvider: user._provider,
            user
        })

        window.localStorage.setItem('socialUser', JSON.stringify(user));
    }

    onLoginFailure (err) {
        console.error(err)

        this.setState({
            logged: false,
            currentProvider: '',
            user: {}
        })

        window.localStorage.removeItem('socialUser');
    }

    onLogoutSuccess () {
        this.setState({
            logged: false,
            currentProvider: '',
            user: {}
        })
    }

    onLogoutFailure (err) {
        console.error(err)
    }

    logout () {
        const { logged, currentProvider } = this.state

        if (logged && currentProvider) {
            window.localStorage.removeItem('socialUser');
            this.nodes[currentProvider].props.triggerLogout()
        }
    }

    render () {
        let children = [];

        if (window.localStorage.getItem('socialUser') != null) {
            //children.push(<Button key={'logout'} onClick={() => this.logout()}>{this.props.t('logout')}</Button>)
        } else {
            children.push(
                <SocialButton
                    provider='facebook'
                    appId={process.env.REACT_APP_FACEBOOK_APPID}
                    onLoginSuccess={this.onLoginSuccess}
                    onLoginFailure={this.onLoginFailure}
                    onLogoutSuccess={this.onLogoutSuccess}
                    getInstance={this.setNodeRef.bind(this, 'facebook')}
                    key={'facebook'}
                    onInternetFailure = {()=>{return true}}
                >
                    {this.props.t('login-with-facebook')}
                </SocialButton>);
        }

        return children
    }
}

export default withTranslation()(SocialAuth);

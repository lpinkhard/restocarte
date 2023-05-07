import React from 'react';
import Menu from "./Menu";
import {View} from "@aws-amplify/ui-react";
import Subscribe from './Subscribe';
import MainHeading from "./MainHeading";
import {Card, Container, Header, Image, List} from "semantic-ui-react";

const SignUp = () => {
    return (
        <View className="SignUp">
            <View className="MainHeading">
                <Container fluid>
                    <Header as="h1" textAlign="center">
                        <Image src="logo512.png" alt="Restocarte" />
                    </Header>
                </Container>
            </View>

            <Card.Group centered>
                <Card id="standardPlan">
                    <Card.Content>
                        <Card.Header textAlign="center">Restocarte Standard</Card.Header>
                        <Card.Description>
                            <List bulleted>
                                <List.Item>Menu builder with multiple categories</List.Item>
                                <List.Item>QR codes and/or NFC tags for menus with table/room identifiers</List.Item>
                                <List.Item>Custom branding with logo and styles</List.Item>
                                <List.Item>Printable menus & QR codes</List.Item>
                            </List>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Subscribe plan={0} />
                        $ 25.00 per month<br />
                        First 30 days free
                    </Card.Content>
                </Card>
                <Card id="advancedPlan">
                    <Card.Content>
                        <Card.Header textAlign="center">Restocarte Advanced</Card.Header>
                        <Card.Description>
                            <List bulleted>
                                <List.Item>Menu builder with multiple categories</List.Item>
                                <List.Item>QR codes and/or NFC tags for menus with table/room identifiers</List.Item>
                                <List.Item>Custom branding with logo and styles</List.Item>
                                <List.Item>Printable menus & QR codes</List.Item>
                                <List.Item>Custom domain names</List.Item>
                                <List.Item>Dynamic pricing according to schedules</List.Item>
                                <List.Item>Special categories based on schedules</List.Item>
                                <List.Item>Online ordering</List.Item>
                            </List>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Subscribe plan={1} comingSoon />
                        $ 45.00 per month<br />
                        First 30 days free
                    </Card.Content>
                </Card>
            </Card.Group>
        </View>
    );
};

export default SignUp;
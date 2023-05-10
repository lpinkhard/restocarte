import React, {useCallback, useState} from "react";
import {Text, Grid, TextField, View, withAuthenticator, CheckboxField} from '@aws-amplify/ui-react';
import QRCode from 'react-qr-code';
import toImg from 'react-svg-to-image';
import MainHeading from "./MainHeading";
import ManagerMenu from "./ManagerMenu";
import {Button, Container, Header, Modal} from "semantic-ui-react";

const Tags = () => {
    const [ restaurant, setRestaurant ] = useState(null);
    const [ contentReady, setContentReady ] = useState(false);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ generatedLink, setGeneratedLink ] = useState("");
    const [ linkIsNFC, setLinkIsNFC] = useState(false);
    const [ linkTableNumber, setLinkTableNumber] = useState(-1);

    const restaurantLoaded = useCallback((val) => {
        setRestaurant(val);
    }, [setRestaurant]);

    const onContentReady = useCallback((val) => {
        setContentReady(val);
    }, [setContentReady]);

    async function createTag(event) {
        event.preventDefault();
        const target = document.getElementById('createTagForm');
        const form = new FormData(target);
        const table = form.get("table");
        const nfc = form.get("nfc");

        let link = window.location.protocol + '//' + window.location.host + '/' + restaurant.id;
        if (table && table.length > 0) {
            link += '/' + table;
            setLinkTableNumber(parseInt(table));
        } else {
            setLinkTableNumber(-1);
        }

        if (nfc) {
            setLinkIsNFC(true);
        } else {
            setLinkIsNFC(false);
        }
        setGeneratedLink(link);
        setModalOpen(true);

        target.reset();
    }

    function downloadQR() {
        let codeName = 'qr';
        if (linkTableNumber >= 0) {
            codeName += "-" + linkTableNumber;
        }

        toImg('#qrCode', codeName, {
            scale: 3,
            format: 'png',
            quality: 0.01,
            download: true
        });
    }

    return (
        <View className="Restaurant">
            <ManagerMenu />
            <MainHeading isManager loadRestaurant={restaurantLoaded} contentReady={onContentReady} />
            {contentReady && (
                <View>
                    <Header as="h2" textAlign="center">Create Tags</Header>
                    {restaurant && (
                        <Container>
                            <Grid id="createTagForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                                <TextField
                                    name="table"
                                    placeholder="Table Number"
                                    descriptiveText="Table number to be embedded in the tag"
                                    label="Table"
                                    type="number"
                                    inputMode="numeric"
                                />
                                <CheckboxField
                                    label="NFC Link"
                                    descriptiveText="Generate a link for an NFC tag rather than a QR code"
                                    name="nfc"
                                    value="yes"
                                    defaultChecked={linkIsNFC}
                                />
                                <Button primary onClick={createTag}>
                                    Create
                                </Button>
                            </Grid>
                        </Container>
                    )}
                    <Modal open={modalOpen}>
                        <Modal.Header>Table Tag</Modal.Header>
                        {linkIsNFC && (
                            <Modal.Content>
                                <Header as="h3" textAlign="center">NFC Link</Header>
                                <Text textAlign="center">{generatedLink}</Text>
                            </Modal.Content>
                        )}
                        {!linkIsNFC && (
                            <Modal.Content>
                                <Header as="h3" textAlign="center">QR Code</Header>
                                <QRCode id="qrCode" value={generatedLink} />
                            </Modal.Content>
                        )}
                        <Modal.Actions>
                            {!linkIsNFC && (
                                <Button positive onClick={() => downloadQR()}>
                                    Download
                                </Button>
                            )}
                            <Button negative onClick={() => setModalOpen(false)}>
                                Close
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </View>
            )}
        </View>
    );
};

export default withAuthenticator(Tags, { hideSignUp: true });

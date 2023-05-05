import React, {useEffect, useState} from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {API, Storage} from "aws-amplify";
import {Button, Card, Collection, Divider, Grid, Heading, Image, Text, TextField, TextAreaField, View, withAuthenticator,} from '@aws-amplify/ui-react';
import {listMenuItems} from "./graphql/queries";
import {createMenuItem as createMenuItemMutation, deleteMenuItem as deleteMenuItemMutation,} from "./graphql/mutations";

const App = ({ signOut }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    }

    async function fetchMenuItems() {
        const apiData = await API.graphql({ query: listMenuItems });
        const menuItemsFromAPI = apiData.data.listMenuItems.items;
        await Promise.all(
            menuItemsFromAPI.map(async (menuItem) => {
                if (menuItem.image) {
                    menuItem.image = await Storage.get(menuItem.image);
                }
                return menuItem;
            })
        );
        setMenuItems(menuItemsFromAPI);
    }

    async function createMenuItem(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const image = form.get("image");
        const data = {
            title: form.get("title"),
            description: form.get("description"),
            image: image.name,
        };
        if (!!data.image) {
            const fileId = guid();
            await Storage.put(fileId, image);
            data.image = fileId;
        }
        await API.graphql({
            query: createMenuItemMutation,
            variables: { input: data },
        });
        await fetchMenuItems();
        event.target.reset();
    }

    async function deleteMenuItem({ id, image }) {
        const newMenuItems = menuItems.filter((menuItem) => menuItem.id !== id);
        setMenuItems(newMenuItems);
        try {
            await Storage.remove(image);
        } catch {
        }
        await API.graphql({
            query: deleteMenuItemMutation,
            variables: { input: { id } },
        });
    }

    return (
        <View className="App">
            <Heading level={1}>Menu Items</Heading>
            <Collection
                items={menuItems}
                type="list"
                direction="row"
                gap="20px"
                wrap="wrap"
                margin="1rem"
                alignItems="center"
                alignSelf="center"
            >
                {(menuItem) => (
                    <Card
                        key={menuItem.id}
                        borderRadius="medium"
                        width="20rem"
                        variation="outlined"
                    >
                        {menuItem.image && (
                            <Image
                                src={menuItem.image}
                                alt={`${menuItem.title}`}
                                style={{ width: 400 }}
                            />
                        )}
                        <View padding="xs">
                            <Heading padding="medium">{menuItem.title}</Heading>
                            <Text as="span">{menuItem.description}</Text>
                            <Divider padding="xs" />
                            <Button variation="link" isFullWidth onClick={() => deleteMenuItem(menuItem)}>
                                Delete item
                            </Button>
                        </View>
                    </Card>
                )}
            </Collection>

            <Divider orientation="horizontal" />

            <Heading level={2}>New Item</Heading>
            <Grid as="form" rowGap="15px" columnGap="15px" padding="20px" onSubmit={createMenuItem}>
                <TextField
                    name="title"
                    placeholder="Item Title"
                    label="Title"
                    variation="quiet"
                    required
                />
                <TextAreaField
                    name="description"
                    placeholder="Item Description"
                    label="Description"
                    variation="quiet"
                />
                <TextField
                    name="image"
                    label="Image"
                    variation="quiet"
                    type="file"
                />
                <Button type="submit" variation="primary">
                    Create Item
                </Button>
            </Grid>

            <Button onClick={signOut}>Sign Out</Button>
        </View>
    );
};

export default withAuthenticator(App);

import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from "aws-amplify";
import {
    Button,
    Flex,
    Heading,
    Image,
    Text,
    TextField,
    View,
    withAuthenticator,
} from '@aws-amplify/ui-react';
import { listMenuItems } from "./graphql/queries";
import {
    createMenuItem as createMenuItemMutation,
    deleteMenuItem as deleteMenuItemMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    async function fetchMenuItems() {
        const apiData = await API.graphql({ query: listMenuItems });
        const menuItemsFromAPI = apiData.data.listMenuItems.items;
        await Promise.all(
            menuItemsFromAPI.map(async (menuItem) => {
                if (menuItems.image) {
                    const url = await Storage.get(menuItems.id);
                    menuItem.image = url;
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
        if (!!data.image) await Storage.put(data.id, image);
        await API.graphql({
            query: createMenuItemMutation,
            variables: { input: data },
        });
        await fetchMenuItems();
        event.target.reset();
    }

    async function deleteMenuItem({ id }) {
        const newMenuItems = menuItems.filter((menuItem) => menuItem.id !== id);
        setMenuItems(newMenuItems);
        await Storage.remove(id);
        await API.graphql({
            query: deleteMenuItemMutation,
            variables: { input: { id } },
        });
    }

    return (
        <View className="App">
            <Heading level={1}>Menu Items</Heading>
            <View as="form" margin="3rem 0" onSubmit={createMenuItem}>
                <Flex direction="row" justifyContent="center">
                    <TextField
                        name="title"
                        placeholder="Item Title"
                        label="Item Title"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <TextField
                        name="description"
                        placeholder="Item Description"
                        label="Item Description"
                        labelHidden
                        variation="quiet"
                    />
                    <View
                        name="image"
                        as="input"
                        type="file"
                        style={{ alignSelf: "end" }}
                    />
                    <Button type="submit" variation="primary">
                        Create Item
                    </Button>
                </Flex>
            </View>
            <Heading level={2}>Current Menu Items</Heading>
            <View margin="3rem 0">
                {menuItems.map((menuItem) => (
                    <Flex
                        key={menuItem.id || menuItem.title}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text as="strong" fontWeight={700}>
                            {menuItem.title}
                        </Text>
                        <Text as="span">{menuItem.description}</Text>
                        {menuItem.image && (
                            <Image
                                src={menuItem.image}
                                alt={`${menuItem.title}`}
                                style={{ width: 400 }}
                            />
                        )}
                        <Button variation="link" onClick={() => deleteMenuItem(menuItem)}>
                            Delete item
                        </Button>
                    </Flex>
                ))}
            </View>
            <Button onClick={signOut}>Sign Out</Button>
        </View>
    );
};

export default withAuthenticator(App);

import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    Collection,
    Divider,
    Grid,
    Heading,
    Image,
    Text,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import {createMenuItem as createMenuItemMutation, deleteMenuItem as deleteMenuItemMutation,} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listMenuItems} from "./graphql/queries";

const Menu = ({isManager}) => {
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

    async function isAuthenticated() {
        try {
            await Auth.currentAuthenticatedUser();
            return true;
        } catch {
            return false;
        }
    }

    async function fetchMenuItems() {
        let apiData;
        if (await isAuthenticated()) {
            apiData = await API.graphql({ query: listMenuItems, authMode: "AMAZON_COGNITO_USER_POOLS" });
        } else {
            apiData = await API.graphql({query: listMenuItems, authMode: "AWS_IAM"});
        }
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

    function NewItem() {
        if (!isManager) {
            return <View className="NewItem" />
        }
        return (
            <View className="NewItem">
                <Divider orientation="horizontal"/>

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
            </View>
        );
    }

    function DeleteItem(menuItem) {
        if (!isManager) {
            return <View className="DeleteItem" />
        }

        return (
            <View className="DeleteItem">
                <Button variation="link" isFullWidth onClick={() => deleteMenuItem(menuItem)}>
                    Delete item
                </Button>
            </View>
        );
    }

    return (
        <View className="Menu">
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
                                style={{width: 400}}
                            />
                        )}
                        <View padding="xs">
                            <Heading padding="medium">{menuItem.title}</Heading>
                            <Text as="span">{menuItem.description}</Text>
                            <Divider padding="xs"/>
                            <DeleteItem menuItem={menuItem} />
                        </View>
                    </Card>
                )}
            </Collection>

            <NewItem />
        </View>
    );
}

export default Menu;

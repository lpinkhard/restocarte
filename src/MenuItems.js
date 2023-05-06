import React, {useEffect, useState} from "react";
import {
    Divider,
    Grid,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import {createMenuItem as createMenuItemMutation, deleteMenuItem as deleteMenuItemMutation,} from "./graphql/mutations";
import {API, Auth, graphqlOperation, Storage} from "aws-amplify";
import {listMenuItems, getCategory} from "./graphql/queries";
import {Button, Card, Container, Header, Icon, Image, Modal} from "semantic-ui-react";

const MenuItems = ({isManager, category, loadCategory}) => {
    const [menuItems, setMenuItems] = useState([]);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const onBackButtonEvent = (e) => {
        e.preventDefault();
        window.history.pushState(null, null, window.location.pathname);
        resetCategory()
    }

    useEffect(() => {
        fetchCategory();
        fetchMenuItems();
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, []);

    useEffect(() => {
        loadCategory(selectedCategory);
    }, [loadCategory, selectedCategory]);

    function resetCategory() {
        setSelectedCategory(null);
    }

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
        const variables = {
            filter: {
                categoryMenuItemsId: {
                    eq: category
                }
            }
        };

        let apiData;
        if (await isAuthenticated()) {
            apiData = await API.graphql({ query: listMenuItems, variables, authMode: "AMAZON_COGNITO_USER_POOLS" });
        } else {
            apiData = await API.graphql({query: listMenuItems, variables, authMode: "AWS_IAM"});
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

    async function fetchCategory() {
        const { data } = await API.graphql(
            graphqlOperation(getCategory, { id: selectedCategory })
        );

        const categoryData = data.getCategory;
        setCategoryTitle(categoryData.title);
    }

    async function createMenuItem(event) {
        event.preventDefault();
        const target = document.getElementById('newMenuItemForm');
        const form = new FormData(target);
        const image = form.get("image");
        const data = {
            title: form.get("title"),
            description: form.get("description"),
            image: image.name,
            categoryMenuItemsId: category,
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
        target.reset();
        toggleCreate(false);
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

    function toggleCreate(value) {
        setIsCreateOpen(value);
    }

    function NewItem() {
        if (!isManager) {
            return <Modal className="NewItem" />
        }
        return (
            <Modal className="NewItem" dimmer="blurring" open={isCreateOpen}>
                <Modal.Header>New Item</Modal.Header>
                <Modal.Content>
                    <Grid id="newMenuItemForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
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
                        <Button type="submit" primary>
                            Create Item
                        </Button>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={createMenuItem}>
                        Create
                    </Button>
                    <Button negative onClick={() => toggleCreate(false)}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    function DeleteItem(id, image) {
        if (!isManager) {
            return <View className="DeleteItem" />
        }

        return (
            <View className="DeleteItem">
                <Button icon onClick={(e) => { e.stopPropagation(); deleteMenuItem(id, image);}}>
                    <Icon name="delete" />
                </Button>
            </View>
        );
    }

    function FormatCurrency({value}) {
        let val = value.toString().replace(/\$|\,/g, '');
        if (isNaN(val))
        {
            val = "0";
        }

        val = Math.floor(val * 100 + 0.50000000001);
        let cents = val % 100;
        val = Math.floor(val / 100).toString();

        if (cents < 10)
        {
            cents = "0" + cents;
        }
        for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++)
        {
            val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
        }

        const formattedValue = '$' + val + '.' + cents;

        return (
            <Container fluid>{formattedValue}</Container>
        );
    }

    return (
        <View className="MenuItems">
            <Header as="h2" textAlign="center">{categoryTitle}</Header>
            <Card.Group centered>
                {menuItems.map((menuItem) => (
                    <Card key={menuItem.id}>
                        {menuItem.image && (
                            <Image
                                src={menuItem.image}
                                alt={`${menuItem.title}`}
                                style={{width: 400}}
                            />
                        )}
                        <Card.Content>
                            <DeleteItem id={menuItem.id} image={menuItem.image}/>
                            <Card.Header textAlign="center">{menuItem.title}</Card.Header>
                            {menuItem.description && (
                                <Card.Description>{menuItem.description}</Card.Description>
                            )}
                        </Card.Content>
                        {menuItem.price && (
                            <Card.Content extra>
                                <FormatCurrency value={menuItem.price} />
                            </Card.Content>
                        )}
                    </Card>
                ))}
            </Card.Group>
            <NewItem />
            {(isManager & !isCreateOpen) && (
                <Button primary circular icon className="floatingButton" onClick={() => toggleCreate(true)}>
                    <Icon name="plus" />
                </Button>
            )}
        </View>
    );
}

export default MenuItems;

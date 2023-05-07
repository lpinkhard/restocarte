import React, {useEffect, useState} from "react";
import {
    CheckboxField,
    Grid,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import {
    createMenuItem as createMenuItemMutation,
    deleteMenuItem as deleteMenuItemMutation,
    updateMenuItem as updateMenuItemMutation,
} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listMenuItems, getCategory} from "./graphql/queries";
import {Button, Card, Container, Header, Icon, Image, Modal} from "semantic-ui-react";

const MenuItems = ({isManager, category, loadCategory, decimals, priceStep, currencySymbol}) => {
    const [ menuItems, setMenuItems ] = useState([]);
    const [ categoryTitle, setCategoryTitle ] = useState('');
    const [ selectedCategory, setSelectedCategory ] = useState(category);
    const [ isCreateOpen, setIsCreateOpen ] = useState(false);
    const [ isEditOpen, setIsEditOpen ] = useState(false);
    const [ editingMenuItem, setEditingMenuItem ] = useState(null);
    const [ dragId, setDragId ] = useState();
    const [ maxOrderId, setMaxOrderId ] = useState(0);
    const [ titleError, setTitleError ] = useState("");
    const [ titleHasError, setTitleHasError ] = useState(false);
    const [ priceError, setPriceError ] = useState("");
    const [ priceHasError, setPriceHasError ] = useState(false);
    const [ busyUpdating, setBusyUpdating ] = useState(false);

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
        let variables;

        if (isManager) {
            variables = {
                filter: {
                    categoryMenuItemsId: {
                        eq: category
                    }
                }
            };
        } else {
            variables = {
                filter: {
                    categoryMenuItemsId: {
                        eq: category
                    },
                    enabled: {
                        eq: true
                    }
                }
            };
        }

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
                if (menuItem.order > maxOrderId) {
                    setMaxOrderId(menuItem.order);
                }
                return menuItem;
            })
        );
        setMenuItems(menuItemsFromAPI);

        if (menuItemsFromAPI.length === 0) {
            setIsCreateOpen(true);
        }
    }

    async function fetchCategory() {
        const { data } = await API.graphql({
            query: getCategory,
            variables: {id: selectedCategory},
            authMode: await isAuthenticated() ? "AMAZON_COGNITO_USER_POOLS" : "AWS_IAM",
        });

        const categoryData = data.getCategory;
        setCategoryTitle(categoryData.title);
    }

    async function createMenuItem(event) {
        event.preventDefault();

        setBusyUpdating(true);

        const target = document.getElementById('newMenuItemForm');
        const form = new FormData(target);

        const title = form.get("title");
        if (!title || title.length <= 0) {
            setTitleError("A title is required");
            setTitleHasError(true);
            return;
        }

        const price = form.get("price");
        if (price) {
            const precision = priceStep / 10;

            const floatPrice = parseFloat(price);

            if (Math.abs(floatPrice - floatPrice.toFixed(decimals)) > precision) {
                setPriceError("Price is invalid");
                setPriceHasError(true);
                return;
            }
        }

        const image = form.get("image");
        const data = {
            title: title,
            description: form.get("description"),
            image: image.name,
            enabled: form.get("enabled") != null,
            order: maxOrderId + 1,
            categoryMenuItemsId: category,
        };
        if (price) {
            data.price = price;
        }
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
        toggleCreate(false);

        target.reset();
        setBusyUpdating(false);
    }

    async function updateMenuItem(event) {
        event.preventDefault();

        setBusyUpdating(true);

        const target = document.getElementById('editMenuItemForm');
        const form = new FormData(target);

        const title = form.get("title");
        if (!title || title.length <= 0) {
            setTitleError("A title is required");
            setTitleHasError(true);
            return;
        }

        const price = form.get("price");
        if (price) {
            const precision = priceStep / 10;

            const floatPrice = parseFloat(price);

            if (Math.abs(floatPrice - floatPrice.toFixed(decimals)) > precision) {
                setPriceError("Price is invalid");
                setPriceHasError(true);
                return;
            }
        }

        const image = form.get("image");
        const data = {
            id: editingMenuItem.id,
            title: title,
            description: form.get("description"),
            enabled: form.get("enabled") != null,
        };
        if (price) {
            data.price = price;
        }
        if (image.name.length > 0) {
            const fileId = guid();
            await Storage.put(fileId, image);
            data.image = fileId;
        }
        await API.graphql({
            query: updateMenuItemMutation,
            variables: { input: data },
        });
        await fetchMenuItems();
        setIsEditOpen(false);

        target.reset();
        setBusyUpdating(false);
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

        if (newMenuItems.length === 0) {
            setIsCreateOpen(true);
        }
    }

    function editMenuItem({id}) {
        setEditingMenuItem(menuItems.find((item) => item.id === id));
        setTitleError("");
        setTitleHasError(false);
        setPriceError("");
        setPriceHasError(false);
        setIsEditOpen(true);
    }

    function toggleCreate(value) {
        setTitleError("");
        setTitleHasError(false);
        setPriceError("");
        setPriceHasError(false);
        setIsCreateOpen(value);
    }

    function EditMenuItemModal() {
        if (!isManager) {
            return <Modal className="EditMenuItemModal" />
        }

        return (
            <Modal className="EditMenuItemModal" dimmer="blurring" open={isEditOpen}>
                <Modal.Header>Edit Item</Modal.Header>
                <Modal.Content>
                    {editingMenuItem && (
                        <Grid id="editMenuItemForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                            <TextField
                                name="title"
                                placeholder="Item Title"
                                descriptiveText="Title for the menu item"
                                label="Title *"
                                hasError={titleHasError}
                                errorMessage={titleError}
                                defaultValue={editingMenuItem.title}
                                required
                            />
                            <TextAreaField
                                name="description"
                                placeholder="Item Description"
                                descriptiveText="Description displayed below title"
                                label="Description"
                                defaultValue={editingMenuItem.description}
                            />
                            <TextField
                                name="price"
                                placeholder="Item Price"
                                descriptiveText="Default price for the menu item"
                                label="Price"
                                hasError={priceHasError}
                                errorMessage={priceError}
                                type="number"
                                step={priceStep}
                                inputMode="decimal"
                                defaultValue={editingMenuItem.price}
                            />
                            <TextField
                                name="image"
                                label="Image"
                                descriptiveText="Image representing the menu item"
                                type="file"
                            />
                            <CheckboxField
                                label="Enabled"
                                name="enabled"
                                value="yes"
                                defaultChecked={editingMenuItem.enabled}
                            />
                        </Grid>
                    )}
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={updateMenuItem} disabled={busyUpdating}>
                        Update
                    </Button>
                    <Button negative onClick={() => setIsEditOpen(false)} disabled={busyUpdating}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    function EditMenuItem(id) {
        if (!isManager) {
            return <View className="EditMenuItem" />
        }

        return (
            <View className="EditMenuItem">
                <Button icon onClick={(e) => { e.stopPropagation(); editMenuItem(id);}}>
                    <Icon name="edit" />
                </Button>
            </View>
        );
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
                            descriptiveText="Title for the menu item"
                            label="Title *"
                            hasError={titleHasError}
                            errorMessage={titleError}
                            required
                        />
                        <TextAreaField
                            name="description"
                            placeholder="Item Description"
                            descriptiveText="Description displayed below title"
                            label="Description"
                        />
                        <TextField
                            name="price"
                            placeholder="Item Price"
                            descriptiveText="Default price for the menu item"
                            label="Price"
                            hasError={priceHasError}
                            errorMessage={priceError}
                            type="number"
                            step={priceStep}
                            inputMode="decimal"
                        />
                        <TextField
                            name="image"
                            label="Image"
                            descriptiveText="Image representing the menu item"
                            type="file"
                        />
                        <CheckboxField
                            label="Enabled"
                            name="enabled"
                            value="yes"
                            defaultChecked="true"
                        />
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={createMenuItem} disabled={busyUpdating}>
                        Create
                    </Button>
                    <Button negative onClick={() => toggleCreate(false)} disabled={busyUpdating}>
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
        const centsInUnit = Math.pow(10, decimals);
        let val = value.toString().replace(/[$,]/g, '');
        if (isNaN(value))
        {
            val = "0";
        }

        val = Math.floor(val * centsInUnit + 0.50000000001);
        let cents = (val % centsInUnit).toString();
        val = Math.floor(val / centsInUnit).toString();

        while (cents.length < decimals)
        {
            cents = "0" + cents;
        }
        for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++)
        {
            val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
        }

        const formattedValue = currencySymbol + ' ' + val + '.' + cents;

        return (
            <Container fluid>{formattedValue}</Container>
        );
    }

    function handleDrag(event) {
        if (!isManager) {
            return false;
        }

        setDragId(event.currentTarget.id);
    }

    async function updateOrder(id, order) {
        const mutationDetails = {
            id: id,
            order: order,
        };

        await API.graphql({
            query: updateMenuItemMutation,
            variables: { input: mutationDetails }
        });
    }

    function handleDrop(event) {
        if (!isManager) {
            return false;
        }

        const dragItem = menuItems.find((item) => item.id === dragId);
        const dropItem = menuItems.find((items) => items.id === event.currentTarget.id);

        const dragItemOrder = dragItem.order;
        const dropItemOrder = dropItem.order;

        const newOrderState = menuItems.map((menuItem) => {
            if (menuItem.id === dragId) {
                menuItem.order = dropItemOrder;
                updateOrder(menuItem.id, menuItem.order);
            }
            if (menuItem.id === event.currentTarget.id) {
                menuItem.order = dragItemOrder;
                updateOrder(menuItem.id, menuItem.order);
            }
            return menuItem;
        });

        setMenuItems(newOrderState);
    }

    return (
        <View className="MenuItems">
            <Header as="h2" textAlign="center">
                {categoryTitle && (
                    <Icon name="caret left" onClick={resetCategory} className="backButton"/>
                )}
                {categoryTitle}
            </Header>
            <Card.Group centered>
                {menuItems.sort((a, b) => a.order - b.order).map((menuItem) => (
                    <Card id={menuItem.id}
                          key={menuItem.id}
                          draggable={isManager ? "true" : "false"}
                          onDragOver={(ev) => ev.preventDefault()}
                          onDragStart={handleDrag}
                          onDrop={handleDrop}>
                        {menuItem.image && (
                            <Image
                                src={menuItem.image}
                                alt={`${menuItem.title}`}
                                style={{width: 400}}
                            />
                        )}
                        <Card.Content>
                            <DeleteItem id={menuItem.id} image={menuItem.image}/>
                            <EditMenuItem id={menuItem.id} />
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

            {isManager && (
                <View>
                    <NewItem />
                    <EditMenuItemModal />
                    {!isCreateOpen && (
                        <Button primary circular icon className="floatingButton" onClick={() => toggleCreate(true)}>
                            <Icon name="plus" />
                        </Button>
                    )}
                </View>
            )}

        </View>
    );
}

export default MenuItems;

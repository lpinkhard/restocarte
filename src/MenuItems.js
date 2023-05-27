import React, {useEffect, useState} from "react";
import {
    CheckboxField, Divider,
    Grid,
    Text,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import {
    createMenuItem as createMenuItemMutation,
    deleteMenuItem as deleteMenuItemMutation,
    updateMenuItem as updateMenuItemMutation,
    createMenuItemOption as createMenuItemOptionMutation,
    deleteMenuItemOption as deleteMenuItemOptionMutation,
} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listMenuItems, getCategory, getMenuItem} from "./graphql/queries";
import {Button, Card, Container, Header, Icon, Image, List, Modal} from "semantic-ui-react";
import {cdnPath, guid, resizeImageFile} from "./Helpers";
import {useTranslation} from "react-i18next";

const MenuItems = ({isManager, restaurant, category, loadCategory, tableId, decimals, priceStep, currencySymbol, webp}) => {
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
    const [ orderItems, setOrderItems ] = useState([]);
    const [ isSubmitBlocked, setIsSubmitBlocked ] = useState(false);

    const onBackButtonEvent = (e) => {
        e.preventDefault();
        window.history.pushState(null, null, window.location.pathname);
        resetCategory()
    }

    const { t } = useTranslation();

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
        const auth = await isAuthenticated();
        if (auth) {
            apiData = await API.graphql({ query: listMenuItems, variables, authMode: "AMAZON_COGNITO_USER_POOLS" });
        } else {
            apiData = await API.graphql({query: listMenuItems, variables, authMode: "AWS_IAM"});
        }
        const menuItemsFromAPI = apiData.data.listMenuItems.items;
        await Promise.all(
            menuItemsFromAPI.map(async (menuItem) => {
                if (menuItem.image) {
                    if (webp) {
                        menuItem.image = cdnPath(menuItem.image + '.webp');
                    } else {
                        menuItem.image = cdnPath(menuItem.image + '.jpg');
                    }
                }
                if (menuItem.order > maxOrderId) {
                    setMaxOrderId(menuItem.order);
                }

                const { data } = await API.graphql({
                    query: getMenuItem,
                    variables: {id: menuItem.id},
                    authMode: auth ? "AMAZON_COGNITO_USER_POOLS" : "AWS_IAM",
                });
                menuItem.options = data.getMenuItem.options.items;

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
            setTitleError(t('title-required'));
            setTitleHasError(true);
            return;
        }

        const price = form.get("price");
        if (price) {
            const precision = priceStep / 10;

            const floatPrice = parseFloat(price);

            if (Math.abs(floatPrice - floatPrice.toFixed(decimals)) > precision) {
                setPriceError(t('price-invalid'));
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
            await Storage.put(fileId + '.jpg', await resizeImageFile(image, 'JPEG'));
            await Storage.put(fileId + '.webp', await resizeImageFile(image, 'WEBP'));
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
            setTitleError(t('title-required'));
            setTitleHasError(true);
            return;
        }

        const price = form.get("price");
        if (price) {
            const precision = priceStep / 10;

            const floatPrice = parseFloat(price);

            if (Math.abs(floatPrice - floatPrice.toFixed(decimals)) > precision) {
                setPriceError(t('price-invalid'));
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
            await Storage.put(fileId + '.jpg', await resizeImageFile(image, 'JPEG'));
            await Storage.put(fileId + '.webp', await resizeImageFile(image, 'WEBP'));
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
            await Storage.remove(image + '.jpg');
            await Storage.remove(image + '.webp');
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

    async function addItemOption(event) {
        event.preventDefault();

        setBusyUpdating(true);

        const target = document.getElementById('editMenuItemForm');
        const form = new FormData(target);

        let data = {
            title: form.get("new-option-name"),
            exclusive: form.get("exclusive") != null,
            menuItemOptionsId: editingMenuItem.id,
        };

        const response = await API.graphql({
            query: createMenuItemOptionMutation,
            variables: { input: data },
        });

        data.id = response.data.createMenuItemOption.id;
        editingMenuItem.options.push(data);

        setBusyUpdating(false);
    }

    async function removeItemOption(optionId) {
        setBusyUpdating(true);

        await API.graphql({
            query: deleteMenuItemOptionMutation,
            variables: { input: { id: optionId } },
        });

        const index = editingMenuItem.options.map(x => {
            return x.id;
        }).indexOf(optionId);
        editingMenuItem.options.splice(index, 1);

        setBusyUpdating(false);
    }

    function EditMenuItemModal() {
        if (!isManager) {
            return <Modal className="EditMenuItemModal" />
        }

        return (
            <Modal className="EditMenuItemModal"
                   dimmer="blurring"
                   open={isEditOpen}
                   onClose={() => setEditingMenuItem(false)}
                   onOpen={() => setEditingMenuItem(true)}>
                <Modal.Header>{t('edit-item')}</Modal.Header>
                <Modal.Content>
                    {editingMenuItem && (
                        <Grid id="editMenuItemForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                            <TextField
                                name="title"
                                placeholder={t('item-title')}
                                descriptiveText={t('title-description-item')}
                                label={t('title-label')}
                                hasError={titleHasError}
                                errorMessage={titleError}
                                defaultValue={editingMenuItem.title}
                                required
                            />
                            <TextAreaField
                                name="description"
                                placeholder={t('item-description')}
                                descriptiveText={t('description-description')}
                                label={t('description-label')}
                                defaultValue={editingMenuItem.description}
                            />
                            <TextField
                                name="price"
                                placeholder={t('item-price')}
                                descriptiveText={t('price-description')}
                                label={t('price-label')}
                                hasError={priceHasError}
                                errorMessage={priceError}
                                type="number"
                                step={priceStep}
                                inputMode="decimal"
                                defaultValue={editingMenuItem.price}
                            />
                            <TextField
                                name="image"
                                label={t('image-label')}
                                descriptiveText={t('image-description-item')}
                                type="file"
                            />
                            <CheckboxField
                                label={t('enabled')}
                                name="enabled"
                                value="yes"
                                defaultChecked={editingMenuItem.enabled}
                            />
                            <Divider />
                            <div className="amplify-flex amplify-field">
                                <label className="amplify-label">{t('options-label')}</label>
                                <Text className="amplify-field__description">{t('options-description')}</Text>
                                {editingMenuItem.options.sort((a, b) => a.order - b.order).map((option) => (
                                    <Text key={option.id}>{option.title} <Icon name="delete" onClick={() => removeItemOption(option.id)} /></Text>
                                ))}
                                <TextField
                                    className="newItemOption"
                                    id="new-option-name"
                                    name="new-option-name"
                                    outerEndComponent={[
                                        <CheckboxField
                                            key="exclusive"
                                            label={t('exclusive')}
                                            name="exclusive"
                                            value="yes"
                                        />,
                                        <Button icon key="add-button" onClick={addItemOption}><Icon name="plus" /></Button>
                                    ]}
                                />
                            </div>
                        </Grid>
                    )}
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={updateMenuItem} disabled={busyUpdating}>
                        {t('update')}
                    </Button>
                    <Button negative onClick={() => setIsEditOpen(false)} disabled={busyUpdating}>
                        {t('cancel')}
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
                <Modal.Header>{t('new-item')}</Modal.Header>
                <Modal.Content>
                    <Grid id="newMenuItemForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                        <TextField
                            name="title"
                            placeholder={t('item-title')}
                            descriptiveText={t('title-description-item')}
                            label={t('title-label')}
                            hasError={titleHasError}
                            errorMessage={titleError}
                            required
                        />
                        <TextAreaField
                            name="description"
                            placeholder={t('item-description')}
                            descriptiveText={t('description-description')}
                            label={t('description-label')}
                        />
                        <TextField
                            name="price"
                            placeholder={t('item-price')}
                            descriptiveText={t('price-description')}
                            label={t('price-label')}
                            hasError={priceHasError}
                            errorMessage={priceError}
                            type="number"
                            step={priceStep}
                            inputMode="decimal"
                        />
                        <TextField
                            name="image"
                            label={t('image-label')}
                            descriptiveText={t('image-description-item')}
                            type="file"
                        />
                        <CheckboxField
                            label={t('enabled')}
                            name="enabled"
                            value="yes"
                            defaultChecked="true"
                        />
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={createMenuItem} disabled={busyUpdating}>
                        {t('create')}
                    </Button>
                    <Button negative onClick={() => toggleCreate(false)} disabled={busyUpdating}>
                        {t('cancel')}
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

    function addToOrder(menuItem) {
        let orderItemData = orderItems.slice(0);
        orderItemData.push(menuItem);
        setOrderItems(orderItemData);
    }

    async function submitOrder() {
        setIsSubmitBlocked(true);

        const orderItemNames = orderItems.map(obj => obj.title);

        await API.post('api0502c1b4', '/submitorder', {
            body: {
                "restaurant": restaurant.id,
                "table": tableId,
                "orderItems": orderItemNames
            }
        }).then(response => {
            setOrderItems([]);
        }).catch(error => {
            console.log(error);
        });

        setIsSubmitBlocked(false);
    }

    function OrderBar() {
        return (
            <Container className="orderBar">
                <Button primary icon size="massive" disabled={isSubmitBlocked} className="submitOrderButton" onClick={() => submitOrder()}>
                    <Icon name="send" />
                </Button>
                <List bulleted>
                    {orderItems.map((orderItem, index) => (
                        <List.Item id={index} key={index}>
                            {orderItem.title}
                        </List.Item>
                    ))}
                </List>
            </Container>
        )
    }

    function BackButton() {
        if (document.documentElement.dir === 'rtl') {
            return (
                <Icon name="caret right" onClick={resetCategory} className="backButton"/>
            );
        }

        return (
            <Icon name="caret left" onClick={resetCategory} className="backButton"/>
        );
    }

    return (
        <View className="MenuItems">
            <Header as="h2" textAlign="center">
                {categoryTitle && (
                    <BackButton />
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
                            {(menuItem.description || menuItem.options.length > 0) && (
                                <Card.Description>
                                    {menuItem.description}
                                    {menuItem.options.length > 0 && (
                                        <List bulleted>
                                        {menuItem.options.sort((a, b) => a.order - b.order).map((option) => (
                                            <List.Item key={option.id}>{option.title}</List.Item>
                                        ))}
                                        </List>
                                    )}
                                </Card.Description>
                            )}
                        </Card.Content>
                        {menuItem.price && (
                            <Card.Content extra>
                                {(!isManager && restaurant.onlineOrders) && (
                                    <Button primary icon className="addToOrderButton" onClick={() => addToOrder(menuItem)}>
                                        <Icon name="cart plus" />
                                    </Button>
                                )}
                                <FormatCurrency value={menuItem.price} />
                            </Card.Content>
                        )}
                    </Card>
                ))}
            </Card.Group>

            {(!isManager && restaurant.onlineOrders && orderItems.length > 0) && (
                <OrderBar />
            )}

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

import React, {useEffect, useState} from "react";
import {
    CheckboxField,
    Grid,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import {
    createCategory as createCategoryMutation,
    updateCategory as updateCategoryMutation,
    deleteCategory as deleteCategoryMutation,
} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listCategories} from "./graphql/queries";
import {Button, Card, Header, Icon, Image, Modal} from "semantic-ui-react";
import {cdnPath, guid, resizeImageFile} from "./Helpers";
import {useTranslation} from "react-i18next";

const Categories = ({isManager, loadCategory, restaurant, webp}) => {
    const { t } = useTranslation();

    const [ categories, setCategories ] = useState([]);
    const [ selectedCategory, setSelectedCategory ] = useState(null);
    const [ isCreateOpen, setIsCreateOpen ] = useState(false);
    const [ isEditOpen, setIsEditOpen ] = useState(false);
    const [ editingCategory, setEditingCategory ] = useState(null);
    const [ dragId, setDragId ] = useState();
    const [ maxOrderId, setMaxOrderId ] = useState(0);
    const [ titleError, setTitleError ] = useState("");
    const [ titleHasError, setTitleHasError ] = useState(false);
    const [ busyUpdating, setBusyUpdating ] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        loadCategory(selectedCategory);
    }, [loadCategory, selectedCategory]);

    function selectCategory(category) {
        setSelectedCategory(category);
    };

    async function isAuthenticated() {
        try {
            await Auth.currentAuthenticatedUser();
            return true;
        } catch {
            return false;
        }
    }

    async function fetchCategories() {
        let variables;
        
        if (!restaurant) {
            return;
        }

        if (isManager) {
            variables = {
                filter: {
                    restaurantCategoriesId: {
                        eq: restaurant.id
                    }
                }
            };
        } else {
            variables = {
                filter: {
                    restaurantCategoriesId: {
                        eq: restaurant.id
                    },
                    enabled: {
                        eq: true
                    }
                }
            };
        }

        let apiData;
        if (await isAuthenticated()) {
            apiData = await API.graphql({ query: listCategories, variables, authMode: "AMAZON_COGNITO_USER_POOLS" });
        } else {
            apiData = await API.graphql({query: listCategories, variables, authMode: "AWS_IAM"});
        }
        const categoriesFromAPI = apiData.data.listCategories.items;
        await Promise.all(
            categoriesFromAPI.map(async (category) => {
                if (category.image) {
                    if (webp) {
                        category.image = cdnPath(category.image + '.webp');
                    } else {
                        category.image = cdnPath(category.image + '.jpg');
                    }
                }
                if (category.order > maxOrderId) {
                    setMaxOrderId(category.order);
                }
                return category;
            })
        );

        setCategories(categoriesFromAPI);

        if (categoriesFromAPI.length === 0) {
            setIsCreateOpen(true);
        }
    }

    function clearValidationErrors() {
        setTitleError("");
        setTitleHasError(false);
    }

    async function createCategory(event) {
        event.preventDefault();

        setBusyUpdating(true);

        if (!restaurant) {
            return;
        }

        const target = document.getElementById('newCategoryForm');
        const form = new FormData(target);

        const title = form.get("title");
        if (!title || title.length <= 0) {
            setTitleError(t('title-required'));
            setTitleHasError(true);
            return;
        }

        const image = form.get("image");
        const data = {
            title: title,
            description: form.get("description"),
            image: image.name,
            enabled: form.get("enabled") != null,
            order: maxOrderId + 1,
            restaurantCategoriesId: restaurant.id
        };
        if (!!data.image) {
            const fileId = guid();
            await Storage.put(fileId + '.jpg', await resizeImageFile(image, 'JPEG'));
            await Storage.put(fileId + '.webp', await resizeImageFile(image, 'WEBP'));
            data.image = fileId;
        }
        await API.graphql({
            query: createCategoryMutation,
            variables: { input: data },
        });
        await fetchCategories();
        toggleCreate(false);

        target.reset();
        setBusyUpdating(false);
    }

    async function updateCategory(event) {
        event.preventDefault();

        setBusyUpdating(true);

        const target = document.getElementById('editCategoryForm');
        const form = new FormData(target);

        const title = form.get("title");
        if (!title || title.length <= 0) {
            setTitleError(t('title-required'));
            setTitleHasError(true);
            return;
        }

        const image = form.get("image");
        const data = {
            id: editingCategory.id,
            title: form.get("title"),
            description: form.get("description"),
            enabled: form.get("enabled") != null,
        };
        if (image.name.length > 0) {
            const fileId = guid();
            await Storage.put(fileId + '.jpg', await resizeImageFile(image, 'JPEG'));
            await Storage.put(fileId + '.webp', await resizeImageFile(image, 'WEBP'));
            data.image = fileId;
        }
        await API.graphql({
            query: updateCategoryMutation,
            variables: { input: data },
        });
        await fetchCategories();
        setIsEditOpen(false);

        target.reset();
        setBusyUpdating(false);
    }

    async function deleteCategory({ id, image }) {
        const newCategories = categories.filter((category) => category.id !== id);
        setCategories(newCategories);
        try {
            await Storage.remove(image + '.jpg');
            await Storage.remove(image + '.webp');
        } catch {
        }
        await API.graphql({
            query: deleteCategoryMutation,
            variables: { input: { id } },
        });

        if (newCategories.length === 0) {
            setIsCreateOpen(true);
        }
    }

    function editCategory({id}) {
        setTitleError("");
        setTitleHasError(false);
        setEditingCategory(categories.find((item) => item.id === id));
        setIsEditOpen(true);
    }

    function NewCategory() {
        if (!isManager) {
            return <Modal className="NewCategory" />
        }
        return (
            <Modal className="NewCategory" dimmer="blurring" open={isCreateOpen}>
                <Modal.Header>{t('new-category')}</Modal.Header>
                <Modal.Content>
                    <Grid id="newCategoryForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                        <TextField
                            name="title"
                            placeholder={t('category-title')}
                            descriptiveText={t('title-description-category')}
                            hasError={titleHasError}
                            errorMessage={titleError}
                            label={t('title-label')}
                            required
                        />
                        <TextAreaField
                            name="description"
                            placeholder={t('category-description')}
                            descriptiveText={t('description-description')}
                            label={t('description-label')}
                        />
                        <TextField
                            name="image"
                            label={t('image-label')}
                            descriptiveText={t('image-description-category')}
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
                    <Button positive onClick={createCategory} disabled={busyUpdating}>
                        {t('create')}
                    </Button>
                    <Button negative onClick={() => toggleCreate(false)} disabled={busyUpdating}>
                        {t('cancel')}
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    function toggleCreate(value) {
        clearValidationErrors();
        setIsCreateOpen(value);
    }

    function EditCategoryModal() {
        if (!isManager) {
            return <Modal className="EditCategoryModal" />
        }

        return (
            <Modal className="EditCategoryModal" dimmer="blurring" open={isEditOpen}>
                <Modal.Header>{t('edit-category')}</Modal.Header>
                <Modal.Content>
                    {editingCategory && (
                    <Grid id="editCategoryForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                        <TextField
                            name="title"
                            placeholder={t('category-title')}
                            descriptiveText={t('title-description-category')}
                            label={t('title-label')}
                            hasError={titleHasError}
                            errorMessage={titleError}
                            defaultValue={editingCategory.title}
                            required
                        />
                        <TextAreaField
                            name="description"
                            placeholder={t('category-description')}
                            label={t('description-label')}
                            descriptiveText={t('description-description')}
                            defaultValue={editingCategory.description}
                        />
                        <TextField
                            name="image"
                            label={t('image-label')}
                            descriptiveText={t('image-description-category')}
                            type="file"
                        />
                        <CheckboxField
                            label={t('enabled')}
                            name="enabled"
                            value="yes"
                            defaultChecked={editingCategory.enabled}
                        />
                    </Grid>
                    )}
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={updateCategory} disabled={busyUpdating}>
                        {t('update')}
                    </Button>
                    <Button negative onClick={() => setIsEditOpen(false)} disabled={busyUpdating}>
                        {t('cancel')}
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    function EditCategory(id) {
        if (!isManager) {
            return <View className="EditCategory" />
        }

        return (
            <View className="EditCategory">
                <Button icon onClick={(e) => { e.stopPropagation(); editCategory(id);}}>
                    <Icon name="edit" />
                </Button>
            </View>
        );
    }

    function DeleteCategory(id, image) {
        if (!isManager) {
            return <View className="DeleteCategory" />
        }

        return (
            <View className="DeleteCategory">
                <Button icon onClick={(e) => { e.stopPropagation(); deleteCategory(id, image);}}>
                    <Icon name="delete" />
                </Button>
            </View>
        );
    }

    function HeadingDisplay() {
        if (isManager) {
            return (
                <View className="HeadingDisplay">
                    <Header as="h2" textAlign="center">{t('categories')}</Header>
                </View>
            )
        }

        return <View className="HeadingDisplay" />
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
            query: updateCategoryMutation,
            variables: { input: mutationDetails }
        });
    }

    function handleDrop(event) {
        if (!isManager) {
            return false;
        }

        const dragItem = categories.find((item) => item.id === dragId);
        const dropItem = categories.find((items) => items.id === event.currentTarget.id);

        const dragItemOrder = dragItem.order;
        const dropItemOrder = dropItem.order;

        const newOrderState = categories.map((category) => {
            if (category.id === dragId) {
                category.order = dropItemOrder;
                updateOrder(category.id, category.order);
            }
            if (category.id === event.currentTarget.id) {
                category.order = dragItemOrder;
                updateOrder(category.id, category.order);
            }
            return category;
        });

        setCategories(newOrderState);
    }

    function ManagerView() {
        return (
            <View>
                <NewCategory />
                <EditCategoryModal />
                {!isCreateOpen && (
                    <Button primary circular icon className="floatingButton" onClick={() => toggleCreate(true)}>
                        <Icon name="plus" />
                    </Button>
                )}
            </View>
        );
    }

    return (
        <View className="Categories">
            <HeadingDisplay />
            <Card.Group centered>
                {categories.sort((a, b) => a.order - b.order).map((category) => (
                    <Card id={category.id}
                          key={category.id}
                          draggable={isManager ? "true" : "false"}
                          onDragOver={(ev) => ev.preventDefault()}
                          onDragStart={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => selectCategory(category.id)}>
                        {category.image && (
                            <Image
                                src={category.image}
                                alt={`${category.title}`}
                                style={{width: 400}}
                            />
                        )}
                        <Card.Content>
                            <DeleteCategory id={category.id} image={category.image}/>
                            <EditCategory id={category.id} />
                            <Card.Header textAlign="center">{category.title}</Card.Header>
                            {category.description && (
                                <Card.Description>{category.description}</Card.Description>
                            )}
                        </Card.Content>
                    </Card>
                    ))}
            </Card.Group>

            {isManager && (
                <ManagerView />
            )}

        </View>
    );
}

export default Categories;

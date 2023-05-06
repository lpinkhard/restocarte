import React, {useEffect, useState} from "react";
import {
    Divider,
    Grid,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import {createCategory as createCategoryMutation, deleteCategory as deleteCategoryMutation,} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listCategories} from "./graphql/queries";
import {Button, Card, Container, Header, Icon, Image, Modal} from "semantic-ui-react";

const Categories = ({isManager, loadCategory}) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        loadCategory(selectedCategory);
    }, [loadCategory, selectedCategory]);

    function selectCategory(category) {
        setSelectedCategory(category);
    };

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

    async function fetchCategories() {
        let apiData;
        if (await isAuthenticated()) {
            apiData = await API.graphql({ query: listCategories, authMode: "AMAZON_COGNITO_USER_POOLS" });
        } else {
            apiData = await API.graphql({query: listCategories, authMode: "AWS_IAM"});
        }
        const categoriesFromAPI = apiData.data.listCategories.items;
        await Promise.all(
            categoriesFromAPI.map(async (category) => {
                if (category.image) {
                    category.image = await Storage.get(category.image);
                }
                return category;
            })
        );
        setCategories(categoriesFromAPI);
    }

    async function createCategory(event) {
        event.preventDefault();
        const target = document.getElementById('newCategoryForm');
        const form = new FormData(target);
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
            query: createCategoryMutation,
            variables: { input: data },
        });
        await fetchCategories();
        target.reset();
        toggleCreate(false);
    }

    async function deleteCategory({ id, image }) {
        const newCategories = categories.filter((category) => category.id !== id);
        setCategories(newCategories);
        try {
            await Storage.remove(image);
        } catch {
        }
        await API.graphql({
            query: deleteCategoryMutation,
            variables: { input: { id } },
        });
    }

    function NewCategory() {
        if (!isManager) {
            return <Modal className="NewCategory" />
        }
        return (
            <Modal className="NewCategory" dimmer="blurring" open={isCreateOpen}>
                <Modal.Header>New Category</Modal.Header>
                <Modal.Content>
                    <Grid id="newCategoryForm" as="form" rowGap="15px" columnGap="15px" padding="20px">
                        <TextField
                            name="title"
                            placeholder="Category Title"
                            label="Title"
                            variation="quiet"
                            required
                        />
                        <TextAreaField
                            name="description"
                            placeholder="Category Description"
                            label="Description"
                            variation="quiet"
                        />
                        <TextField
                            name="image"
                            label="Image"
                            variation="quiet"
                            type="file"
                        />
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={createCategory}>
                        Create
                    </Button>
                    <Button negative onClick={() => toggleCreate(false)}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    function toggleCreate(value) {
        setIsCreateOpen(value);
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
                    <Header as="h2" textAlign="center">Categories</Header>
                </View>
            )
        }

        return <View className="HeadingDisplay" />
    }

    return (
        <View className="Category">
            <HeadingDisplay />
            <Card.Group centered>
                {categories.map((category) => (
                        <Card key={category.id} onClick={() => selectCategory(category.id)}>
                        {category.image && (
                            <Image
                                src={category.image}
                                alt={`${category.title}`}
                                style={{width: 400}}
                            />
                        )}
                        <Card.Content>
                            <DeleteCategory id={category.id} image={category.image}/>
                            <Card.Header textAlign="center">{category.title}</Card.Header>
                            {category.description && (
                                <Card.Description>{category.description}</Card.Description>
                            )}
                        </Card.Content>
                    </Card>
                    ))}
            </Card.Group>

            <NewCategory />
            {(isManager & !isCreateOpen) && (
                <Button primary circular icon className="floatingButton" onClick={() => toggleCreate(true)}>
                    <Icon name="plus" />
                </Button>
            )}
        </View>
    );
}

export default Categories;

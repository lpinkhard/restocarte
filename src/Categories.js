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
import {createCategory as createCategoryMutation, deleteCategory as deleteCategoryMutation,} from "./graphql/mutations";
import {API, Auth, Storage} from "aws-amplify";
import {listCategories} from "./graphql/queries";

const Categories = ({isManager, loadCategory}) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

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
            query: createCategoryMutation,
            variables: { input: data },
        });
        await fetchCategories();
        event.target.reset();
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
            return <View className="NewCategory" />
        }
        return (
            <View className="NewCategory">
                <Divider orientation="horizontal"/>

                <Heading level={2}>New Category</Heading>
                <Grid as="form" rowGap="15px" columnGap="15px" padding="20px" onSubmit={createCategory}>
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
                    <Button type="submit" variation="primary">
                        Create Category
                    </Button>
                </Grid>
            </View>
        );
    }

    function DeleteCategory(category) {
        if (!isManager) {
            return <View className="DeleteCategory" />
        }

        return (
            <View className="DeleteCategory">
                <Divider padding="xs"/>
                <Button variation="link" isFullWidth onClick={() => deleteCategory(category)}>
                    Delete category
                </Button>
            </View>
        );
    }

    function HeadingDisplay() {
        if (isManager) {
            return (
                <View className="HeadingDisplay">
                    <Heading level={1}>Categories</Heading>
                </View>
            )
        }

        return <View className="HeadingDisplay" />
    }

    return (
        <View className="Category">
            <HeadingDisplay />
            <Collection
                items={categories}
                type="list"
                direction="row"
                gap="20px"
                wrap="wrap"
                margin="1rem"
                alignItems="center"
                alignSelf="center"
            >
                {(category) => (
                    <Card
                        key={category.id}
                        borderRadius="medium"
                        width="20rem"
                        variation="outlined"
                        onClick={() => selectCategory(category.id)}
                    >
                        {category.image && (
                            <Image
                                src={category.image}
                                alt={`${category.title}`}
                                style={{width: 400}}
                            />
                        )}
                        <View padding="xs">
                            <Heading padding="medium">{category.title}</Heading>
                            <Text as="span">{category.description}</Text>
                            <DeleteCategory category={category} />
                        </View>
                    </Card>
                )}
            </Collection>

            <NewCategory />
        </View>
    );
}

export default Categories;

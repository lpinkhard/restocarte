/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMenuItem = /* GraphQL */ `
  mutation CreateMenuItem(
    $input: CreateMenuItemInput!
    $condition: ModelMenuItemConditionInput
  ) {
    createMenuItem(input: $input, condition: $condition) {
      id
      category {
        id
        title
        description
        enabled
        price
        image
        menuItems {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        restaurantCategoriesId
        owner
      }
      title
      description
      enabled
      price
      image
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      categoryMenuItemsId
      owner
    }
  }
`;
export const updateMenuItem = /* GraphQL */ `
  mutation UpdateMenuItem(
    $input: UpdateMenuItemInput!
    $condition: ModelMenuItemConditionInput
  ) {
    updateMenuItem(input: $input, condition: $condition) {
      id
      category {
        id
        title
        description
        enabled
        price
        image
        menuItems {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        restaurantCategoriesId
        owner
      }
      title
      description
      enabled
      price
      image
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      categoryMenuItemsId
      owner
    }
  }
`;
export const deleteMenuItem = /* GraphQL */ `
  mutation DeleteMenuItem(
    $input: DeleteMenuItemInput!
    $condition: ModelMenuItemConditionInput
  ) {
    deleteMenuItem(input: $input, condition: $condition) {
      id
      category {
        id
        title
        description
        enabled
        price
        image
        menuItems {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        restaurantCategoriesId
        owner
      }
      title
      description
      enabled
      price
      image
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      categoryMenuItemsId
      owner
    }
  }
`;
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
      id
      title
      description
      enabled
      price
      image
      menuItems {
        items {
          id
          title
          description
          enabled
          price
          image
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          categoryMenuItemsId
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      restaurantCategoriesId
      owner
    }
  }
`;
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
      id
      title
      description
      enabled
      price
      image
      menuItems {
        items {
          id
          title
          description
          enabled
          price
          image
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          categoryMenuItemsId
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      restaurantCategoriesId
      owner
    }
  }
`;
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
      id
      title
      description
      enabled
      price
      image
      menuItems {
        items {
          id
          title
          description
          enabled
          price
          image
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          categoryMenuItemsId
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      restaurantCategoriesId
      owner
    }
  }
`;
export const createRestaurant = /* GraphQL */ `
  mutation CreateRestaurant(
    $input: CreateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    createRestaurant(input: $input, condition: $condition) {
      id
      name
      logo
      categories {
        items {
          id
          title
          description
          enabled
          price
          image
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          restaurantCategoriesId
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const updateRestaurant = /* GraphQL */ `
  mutation UpdateRestaurant(
    $input: UpdateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    updateRestaurant(input: $input, condition: $condition) {
      id
      name
      logo
      categories {
        items {
          id
          title
          description
          enabled
          price
          image
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          restaurantCategoriesId
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const deleteRestaurant = /* GraphQL */ `
  mutation DeleteRestaurant(
    $input: DeleteRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    deleteRestaurant(input: $input, condition: $condition) {
      id
      name
      logo
      categories {
        items {
          id
          title
          description
          enabled
          price
          image
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          restaurantCategoriesId
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;

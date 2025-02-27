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
        order
        menuItems {
          nextToken
        }
        owner
        createdAt
        updatedAt
        restaurantCategoriesId
      }
      title
      description
      enabled
      price
      image
      options {
        items {
          id
          title
          priceDelta
          exclusive
          order
          owner
          createdAt
          updatedAt
          menuItemOptionsId
        }
        nextToken
      }
      order
      owner
      createdAt
      updatedAt
      categoryMenuItemsId
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
        order
        menuItems {
          nextToken
        }
        owner
        createdAt
        updatedAt
        restaurantCategoriesId
      }
      title
      description
      enabled
      price
      image
      options {
        items {
          id
          title
          priceDelta
          exclusive
          order
          owner
          createdAt
          updatedAt
          menuItemOptionsId
        }
        nextToken
      }
      order
      owner
      createdAt
      updatedAt
      categoryMenuItemsId
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
        order
        menuItems {
          nextToken
        }
        owner
        createdAt
        updatedAt
        restaurantCategoriesId
      }
      title
      description
      enabled
      price
      image
      options {
        items {
          id
          title
          priceDelta
          exclusive
          order
          owner
          createdAt
          updatedAt
          menuItemOptionsId
        }
        nextToken
      }
      order
      owner
      createdAt
      updatedAt
      categoryMenuItemsId
    }
  }
`;
export const createMenuItemOption = /* GraphQL */ `
  mutation CreateMenuItemOption(
    $input: CreateMenuItemOptionInput!
    $condition: ModelMenuItemOptionConditionInput
  ) {
    createMenuItemOption(input: $input, condition: $condition) {
      id
      menuItem {
        id
        category {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          restaurantCategoriesId
        }
        title
        description
        enabled
        price
        image
        options {
          nextToken
        }
        order
        owner
        createdAt
        updatedAt
        categoryMenuItemsId
      }
      title
      priceDelta
      exclusive
      order
      owner
      createdAt
      updatedAt
      menuItemOptionsId
    }
  }
`;
export const updateMenuItemOption = /* GraphQL */ `
  mutation UpdateMenuItemOption(
    $input: UpdateMenuItemOptionInput!
    $condition: ModelMenuItemOptionConditionInput
  ) {
    updateMenuItemOption(input: $input, condition: $condition) {
      id
      menuItem {
        id
        category {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          restaurantCategoriesId
        }
        title
        description
        enabled
        price
        image
        options {
          nextToken
        }
        order
        owner
        createdAt
        updatedAt
        categoryMenuItemsId
      }
      title
      priceDelta
      exclusive
      order
      owner
      createdAt
      updatedAt
      menuItemOptionsId
    }
  }
`;
export const deleteMenuItemOption = /* GraphQL */ `
  mutation DeleteMenuItemOption(
    $input: DeleteMenuItemOptionInput!
    $condition: ModelMenuItemOptionConditionInput
  ) {
    deleteMenuItemOption(input: $input, condition: $condition) {
      id
      menuItem {
        id
        category {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          restaurantCategoriesId
        }
        title
        description
        enabled
        price
        image
        options {
          nextToken
        }
        order
        owner
        createdAt
        updatedAt
        categoryMenuItemsId
      }
      title
      priceDelta
      exclusive
      order
      owner
      createdAt
      updatedAt
      menuItemOptionsId
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
      order
      menuItems {
        items {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          categoryMenuItemsId
        }
        nextToken
      }
      owner
      createdAt
      updatedAt
      restaurantCategoriesId
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
      order
      menuItems {
        items {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          categoryMenuItemsId
        }
        nextToken
      }
      owner
      createdAt
      updatedAt
      restaurantCategoriesId
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
      order
      menuItems {
        items {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          categoryMenuItemsId
        }
        nextToken
      }
      owner
      createdAt
      updatedAt
      restaurantCategoriesId
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
      tagline
      logo
      favicon
      categories {
        items {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          restaurantCategoriesId
        }
        nextToken
      }
      userId
      currency
      socialLogin
      styleData
      onlineOrders
      owner
      createdAt
      updatedAt
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
      tagline
      logo
      favicon
      categories {
        items {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          restaurantCategoriesId
        }
        nextToken
      }
      userId
      currency
      socialLogin
      styleData
      onlineOrders
      owner
      createdAt
      updatedAt
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
      tagline
      logo
      favicon
      categories {
        items {
          id
          title
          description
          enabled
          price
          image
          order
          owner
          createdAt
          updatedAt
          restaurantCategoriesId
        }
        nextToken
      }
      userId
      currency
      socialLogin
      styleData
      onlineOrders
      owner
      createdAt
      updatedAt
    }
  }
`;

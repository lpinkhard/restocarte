/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMenuItem = /* GraphQL */ `
  query GetMenuItem($id: ID!) {
    getMenuItem(id: $id) {
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
        }
        createdAt
        updatedAt
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
      categoryMenuItemsId
      owner
    }
  }
`;
export const listMenuItems = /* GraphQL */ `
  query ListMenuItems(
    $filter: ModelMenuItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMenuItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        category {
          id
          title
          description
          enabled
          price
          image
          createdAt
          updatedAt
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
        categoryMenuItemsId
        owner
      }
      nextToken
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
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
          categoryMenuItemsId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      restaurantCategoriesId
      owner
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        enabled
        price
        image
        menuItems {
          nextToken
        }
        createdAt
        updatedAt
        restaurantCategoriesId
        owner
      }
      nextToken
    }
  }
`;
export const getRestaurant = /* GraphQL */ `
  query GetRestaurant($id: ID!) {
    getRestaurant(id: $id) {
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
          restaurantCategoriesId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listRestaurants = /* GraphQL */ `
  query ListRestaurants(
    $filter: ModelRestaurantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRestaurants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        logo
        categories {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;

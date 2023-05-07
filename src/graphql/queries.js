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
      order
      owner
      createdAt
      updatedAt
      categoryMenuItemsId
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
        order
        owner
        createdAt
        updatedAt
        categoryMenuItemsId
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
        order
        menuItems {
          nextToken
        }
        owner
        createdAt
        updatedAt
        restaurantCategoriesId
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
      tagline
      logo
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
      owner
      createdAt
      updatedAt
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
        tagline
        logo
        categories {
          nextToken
        }
        userId
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

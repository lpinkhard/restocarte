/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMenuItem = /* GraphQL */ `
  subscription OnCreateMenuItem(
    $filter: ModelSubscriptionMenuItemFilterInput
    $owner: String
  ) {
    onCreateMenuItem(filter: $filter, owner: $owner) {
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
export const onUpdateMenuItem = /* GraphQL */ `
  subscription OnUpdateMenuItem(
    $filter: ModelSubscriptionMenuItemFilterInput
    $owner: String
  ) {
    onUpdateMenuItem(filter: $filter, owner: $owner) {
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
export const onDeleteMenuItem = /* GraphQL */ `
  subscription OnDeleteMenuItem(
    $filter: ModelSubscriptionMenuItemFilterInput
    $owner: String
  ) {
    onDeleteMenuItem(filter: $filter, owner: $owner) {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory(
    $filter: ModelSubscriptionCategoryFilterInput
    $owner: String
  ) {
    onCreateCategory(filter: $filter, owner: $owner) {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory(
    $filter: ModelSubscriptionCategoryFilterInput
    $owner: String
  ) {
    onUpdateCategory(filter: $filter, owner: $owner) {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory(
    $filter: ModelSubscriptionCategoryFilterInput
    $owner: String
  ) {
    onDeleteCategory(filter: $filter, owner: $owner) {
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
export const onCreateRestaurant = /* GraphQL */ `
  subscription OnCreateRestaurant(
    $filter: ModelSubscriptionRestaurantFilterInput
    $owner: String
  ) {
    onCreateRestaurant(filter: $filter, owner: $owner) {
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
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRestaurant = /* GraphQL */ `
  subscription OnUpdateRestaurant(
    $filter: ModelSubscriptionRestaurantFilterInput
    $owner: String
  ) {
    onUpdateRestaurant(filter: $filter, owner: $owner) {
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
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRestaurant = /* GraphQL */ `
  subscription OnDeleteRestaurant(
    $filter: ModelSubscriptionRestaurantFilterInput
    $owner: String
  ) {
    onDeleteRestaurant(filter: $filter, owner: $owner) {
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
      owner
      createdAt
      updatedAt
    }
  }
`;

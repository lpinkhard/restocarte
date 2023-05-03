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
export const onCreateRestaurant = /* GraphQL */ `
  subscription OnCreateRestaurant(
    $filter: ModelSubscriptionRestaurantFilterInput
    $owner: String
  ) {
    onCreateRestaurant(filter: $filter, owner: $owner) {
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
export const onUpdateRestaurant = /* GraphQL */ `
  subscription OnUpdateRestaurant(
    $filter: ModelSubscriptionRestaurantFilterInput
    $owner: String
  ) {
    onUpdateRestaurant(filter: $filter, owner: $owner) {
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
export const onDeleteRestaurant = /* GraphQL */ `
  subscription OnDeleteRestaurant(
    $filter: ModelSubscriptionRestaurantFilterInput
    $owner: String
  ) {
    onDeleteRestaurant(filter: $filter, owner: $owner) {
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

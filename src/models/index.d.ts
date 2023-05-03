import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";





type EagerMenuItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MenuItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly category?: Category | null;
  readonly title: string;
  readonly description?: string | null;
  readonly enabled?: boolean | null;
  readonly price?: number | null;
  readonly image?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly categoryMenuItemsId?: string | null;
}

type LazyMenuItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MenuItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly category: AsyncItem<Category | undefined>;
  readonly title: string;
  readonly description?: string | null;
  readonly enabled?: boolean | null;
  readonly price?: number | null;
  readonly image?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly categoryMenuItemsId?: string | null;
}

export declare type MenuItem = LazyLoading extends LazyLoadingDisabled ? EagerMenuItem : LazyMenuItem

export declare const MenuItem: (new (init: ModelInit<MenuItem>) => MenuItem) & {
  copyOf(source: MenuItem, mutator: (draft: MutableModel<MenuItem>) => MutableModel<MenuItem> | void): MenuItem;
}

type EagerCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly enabled?: boolean | null;
  readonly price?: number | null;
  readonly image?: string | null;
  readonly menuItems?: (MenuItem | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly restaurantCategoriesId?: string | null;
}

type LazyCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly enabled?: boolean | null;
  readonly price?: number | null;
  readonly image?: string | null;
  readonly menuItems: AsyncCollection<MenuItem>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly restaurantCategoriesId?: string | null;
}

export declare type Category = LazyLoading extends LazyLoadingDisabled ? EagerCategory : LazyCategory

export declare const Category: (new (init: ModelInit<Category>) => Category) & {
  copyOf(source: Category, mutator: (draft: MutableModel<Category>) => MutableModel<Category> | void): Category;
}

type EagerRestaurant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Restaurant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly logo?: string | null;
  readonly categories?: (Category | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRestaurant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Restaurant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly logo?: string | null;
  readonly categories: AsyncCollection<Category>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Restaurant = LazyLoading extends LazyLoadingDisabled ? EagerRestaurant : LazyRestaurant

export declare const Restaurant: (new (init: ModelInit<Restaurant>) => Restaurant) & {
  copyOf(source: Restaurant, mutator: (draft: MutableModel<Restaurant>) => MutableModel<Restaurant> | void): Restaurant;
}
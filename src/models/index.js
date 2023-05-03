// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { MenuItem, Category, Restaurant } = initSchema(schema);

export {
  MenuItem,
  Category,
  Restaurant
};
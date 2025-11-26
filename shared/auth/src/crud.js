import { directus } from './directus';
import { readItems, readItem, createItem, updateItem, deleteItem as sdkDeleteItem } from '@directus/sdk';

/**
 * Get items from a collection
 * @param {string} collection - The collection name
 * @param {object} query - The query object (optional)
 * @returns {Promise<Array>} - The list of items
 */
export const getItems = async (collection, query = {}) => {
  return await directus.request(readItems(collection, query));
};

/**
 * Get a single item by ID
 * @param {string} collection - The collection name
 * @param {string|number} id - The item ID
 * @param {object} query - The query object (optional)
 * @returns {Promise<object>} - The item
 */
export const getItem = async (collection, id, query = {}) => {
  return await directus.request(readItem(collection, id, query));
};

/**
 * Create a new item
 * @param {string} collection - The collection name
 * @param {object} data - The item data
 * @returns {Promise<object>} - The created item
 */
export const createNewItem = async (collection, data) => {
  return await directus.request(createItem(collection, data));
};

/**
 * Update an existing item
 * @param {string} collection - The collection name
 * @param {string|number} id - The item ID
 * @param {object} data - The data to update
 * @returns {Promise<object>} - The updated item
 */
export const updateExistingItem = async (collection, id, data) => {
  return await directus.request(updateItem(collection, id, data));
};

/**
 * Delete an item
 * @param {string} collection - The collection name
 * @param {string|number} id - The item ID
 * @returns {Promise<void>}
 */
export const deleteExistingItem = async (collection, id) => {
  return await directus.request(sdkDeleteItem(collection, id));
};

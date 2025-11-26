import { directus } from './directus';
import { readItems, readItem, createItem, updateItem, deleteItem as sdkDeleteItem } from '@directus/sdk';
import { withToken } from '@directus/sdk';


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  const getAuthenticatedClient = () => {
    const token = getCookie('auth_token');
    return token ? directus.with(withToken(token)) : directus;
  }

/**
 * Get items from a collection
 * @param {string} collection - The collection name
 * @param {object} query - The query object (optional)
 * @returns {Promise<Array>} - The list of items
 */
export const getItems = async (collection, query = {}) => {
  const client = getAuthenticatedClient();
  return await client.request(readItems(collection, query));
};

/**
 * Get a single item by ID
 * @param {string} collection - The collection name
 * @param {string|number} id - The item ID
 * @param {object} query - The query object (optional)
 * @returns {Promise<object>} - The item
 */
export const getItem = async (collection, id, query = {}) => {
    const client = getAuthenticatedClient();
    return await client.request(readItem(collection, id, query));
};

/**
 * Create a new item
 * @param {string} collection - The collection name
 * @param {object} data - The item data
 * @returns {Promise<object>} - The created item
 */
export const createNewItem = async (collection, data) => {
    const client = getAuthenticatedClient();
    return await client.request(createItem(collection, data));
};

/**
 * Update an existing item
 * @param {string} collection - The collection name
 * @param {string|number} id - The item ID
 * @param {object} data - The data to update
 * @returns {Promise<object>} - The updated item
 */
export const updateExistingItem = async (collection, id, data) => {
    const client = getAuthenticatedClient();
    return await client.request(updateItem(collection, id, data));
};

/**
 * Delete an item
 * @param {string} collection - The collection name
 * @param {string|number} id - The item ID
 * @returns {Promise<void>}
 */
export const deleteExistingItem = async (collection, id) => {
    const client = getAuthenticatedClient();
    return await client.request(sdkDeleteItem(collection, id));
};
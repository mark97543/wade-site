import { directus } from './directus';
import { 
  readItems, 
  readItem, 
  createItem, 
  updateItem, 
  deleteItem as sdkDeleteItem 
} from '@directus/sdk';
import { withToken } from '@directus/sdk';

const getCookie = (name) => {
  if (typeof document === 'undefined') {
      return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const executeRequest = async (operation) => {
  const token = getCookie('auth_token');
  if (!token) {
    console.error("Authentication token not found. User might be logged out.");
    throw new Error('Authentication token not found.');
  }
  return await directus.request(withToken(token, operation));
};

export const getItems = async (collection, query = {}) => {
  return await executeRequest(readItems(collection, query));
};

export const getItem = async (collection, id, query = {}) => {
  return await executeRequest(readItem(collection, id, query));
};

export const createNewItem = async (collection, data) => {
  return await executeRequest(createItem(collection, data));
};

export const updateExistingItem = async (collection, id, data) => {
  return await executeRequest(updateItem(collection, id, data));
};

export const deleteExistingItem = async (collection, id) => {
  return await executeRequest(sdkDeleteItem(collection, id));
};
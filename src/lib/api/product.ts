import { serverFetch } from "../core/server";


export const getAllProducts = async () => {
  try {
    const res = await serverFetch('/api/products');
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id: string) => {
  try {
    const res = await serverFetch(`/api/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
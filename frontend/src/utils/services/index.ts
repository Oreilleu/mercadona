import { Category, Product, Response } from "../types";

export const filterproducts = (productsData: Product[], selectedCategory: string, showPromotion: boolean) => {
  let filteredProducts = [...productsData];

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter((product: Product) => product.category.name === selectedCategory);
  }

  if (showPromotion) {
    filteredProducts = filteredProducts.filter((product: Product) => product.promotion !== null);
  }

  return filteredProducts;
};

export const getData = async (url: string) => {

  try {
    const response = await fetch(url);

    if(!response.ok) {
      throw new Error('Erreur lors de la récupération des donées');
    }
    const data = await response.json();
    return data;

  } catch (error) {
    return "Erreur lors de la récupération des données" ;
  }
}

export const getProducts = async () => {
  const data: Response | string = await getData('https://localhost:7208/api/ProductControllers/GetAll');
  if (typeof data === 'string') {
    return data;
  }

  if (data.success) {
    return (data.data as Product[]);
  } else {
    return (data.message);
  }
};

export const getCategory = async () => {
  const data: Response | string = await getData('https://localhost:7208/api/Category/GetAll');
  if (typeof data === 'string') {
    return data;
  }

  if (data.success) {
    return data.data as Category[];
  } else {
    return data.message;
  }
};

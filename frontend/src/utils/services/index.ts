import { Category, Product, Promotion, Response } from "../types";

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

export const getPromotions = async () => {
  const data: Response | string = await getData('https://localhost:7208/api/PromotionControllers/GetAll');
  if (typeof data === 'string') {
    return data;
  }

  if (data.success) {
    return data.data as Promotion[];
  } else {
    return data.message;
  }
};

export const postData = async (url: string, body: any) => {
  const token = checkToken();

  if(!token){
    return "Vous devez être connecté pour créer des données" as string;
  }

  try {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if(!response.ok) {
        throw new Error('Erreur lors de la création des données');
      }

      const data: Response = await response.json();
      return data;
  } catch (error) {
    return "Erreur lors de la création des données" as string;
  }
}

export const postFormData = async (url: string, body: FormData) => {
  const token = checkToken();

  if(!token){
    return "Vous devez être connecté pour créer des données" as string;
  }

  try {
    const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: body,
      });

      if(!response.ok) {
        throw new Error('Erreur lors de la création des données');
      }

      const data: Response = await response.json();
      return data;
  } catch (error) {
    return "Erreur lors de la création des données" as string;
  }
}

export const putData = async (url: string, body: any) => {
  const token = checkToken();

  if(!token){
    return "Vous devez être connecté pour modifier des données" as string;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    if(!response.ok) {
      throw new Error('Erreur lors de la modification des données');
    }

    const data: Response = await response.json();
    return data;

  } catch (error) {
    return "Erreur lors de la modification des données" as string;
  }


}

export const deleteData = async (url: string, id: number) => {
  const token = checkToken();

  if(!token){
    return "Vous devez être connecté pour supprimer des données" as string;
  }

  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if(!response.ok) {
      throw new Error('Erreur lors de la suppression des données');
    }

    const data: Response = await response.json();
    return data;

  } catch (error) {
    return "Erreur lors de la suppression des données" as string;
  }
}

export const checkToken = () => {
  const token = document.cookie.split('=')[1];

  return token;
}

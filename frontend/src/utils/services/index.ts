import { Category, Product, Promotion, Response, User } from "../types";

export const filterproducts = (productsData: Product[], selectedCategory: string, showPromotion: boolean) => {
  let filteredProducts = [...productsData];

  const acutalDate = new Date()

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter((product: Product) => product.category.name === selectedCategory);
  }

  if (showPromotion) {
    filteredProducts = filteredProducts.filter((product: Product) => product.promotion && acutalDate >= new Date(product.promotion.startingDate) && acutalDate <= new Date(product.promotion.endingDate));
  }

  return filteredProducts;
};

export const getData = async (url: string) => {

  try {
    const response = await fetch(url)

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
  const data: Response | string = await getData(`${process.env.NEXT_PUBLIC_API_URL}/api/ProductControllers/GetAll`);
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
  const data: Response | string = await getData(`${process.env.NEXT_PUBLIC_API_URL}/api/Category/GetAll`);
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
  const data: Response | string = await getData(`${process.env.NEXT_PUBLIC_API_URL}/api/PromotionControllers/GetAll`);
  if (typeof data === 'string') {
    return data;
  }

  if (data.success) {
    return data.data as Promotion[];
  } else {
    return data.message;
  }
};

export const getUsers = async () => {
  const token = checkToken();

  if(!token){
    return "Vous devez être connecté pour créer des données" as string;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/GetAll`,{
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if(!response.ok) {
      throw new Error('Erreur lors de la récupération des donées');
    }

    const data = await response.json();

    if (typeof data === 'string') {
      return data;
    }

    if (data.success) {
      return data.data as User[];
    } else {
      return data.message;
    }

  } catch (error) {
    return "Erreur lors de la récupération des données" ;
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
        const data = await response.json();
        throw new Error(data.message || "");
      }

      const data: Response = await response.json();

      return data;
  } catch (error) {
    return String(error) || String("Erreur lors de la création des données");
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

export const verifyToken = async () => {
  const token = checkToken();

  if(!token){
    console.error("pas de token")
    return;
  }


  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/verifytoken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(token),
  });

  if(!response.ok) {
    console.error("erreur de vérification du token")
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "/";
    return;
  }

  const isValidToken: Response = await response.json();

  if(!isValidToken.data) {
    console.error("token invalide")
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "/";
    return;
  }

  return true;
};

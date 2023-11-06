import { Product } from "../types";

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

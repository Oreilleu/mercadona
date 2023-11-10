export type Category = {
  id: number;
  name: string;
  products: Product[];
};

export type Promotion = {
  id?: number;
  name: string;
  startingDate: string;
  endingDate: string;
  discountPercentage: number;
};

export type Product = {
  id?: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: Category;
  promotion: Promotion;
};

export type CreateProduct = {
  name: string;
  price: number;
  description: string;
  categoryId?: number;
  promotionId?: number;
};

export type UpdateProduct = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId?: number;
  promotionId?: number;
};


export type Response = {
  data: any[];
  success: boolean;
  message: string
}

export type Category = {
  id: number;
  name: string;
  products: Product[];
};

export type Promotion = {
  id: number;
  name: string;
  startingDate: Date;
  endingDate: Date;
  discountPercentage: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  promotion: Promotion;
};

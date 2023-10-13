'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export type Category = {
  id: number;
  name: string;
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

// TODO : Ajouter une image à la base de données
// TODO : Filtrer en fonction de la catégorie et du boolean promotion

export default function Home() {
  const [showPromotion, setShowPromotion] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listCategories, setListCategories] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const filterproducts = (productsData: Product[], selectedCategory: string) => {
    let filteredProducts = [...productsData];

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product: Product) => product.category.name === selectedCategory);
    }

    if (showPromotion) {
      filteredProducts = filteredProducts.filter((product: Product) => product.promotion !== null);
    }

    return filteredProducts;
  };

  useEffect(() => {
    if (!productsData) return;

    setFilteredProducts(filterproducts(productsData, selectedCategory));
  }, [productsData, selectedCategory, showPromotion]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch('https://localhost:7208/api/ProductControllers/GetAll');
        if (response.ok) {
          const data = await response.json();
          setProductsData(data.data);
        } else {
          console.error('Les données demandées ne sont pas disponibles.');
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des produits :", error);
      }
    };

    const getCategory = async () => {
      try {
        const response = await fetch('https://localhost:7208/api/Category/GetAll');
        if (response.ok) {
          const data = await response.json();
          setListCategories(data.data.map((category: Category) => category.name));
        } else {
          console.error('Les données demandées ne sont pas disponibles.');
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des produits :", error);
      }
    };

    getProducts();
    getCategory();
  }, []);

  return (
    <Layout className="container-homepage">
      <Banner title="Catalogue" />
      {productsData.length === 0 ? (
        <p className="text-center text-danger">Il n'y a pas de produit à afficher</p>
      ) : (
        <>
          <Container className="container-button">
            <select onChange={(e) => setSelectedCategory(e.target.value)} name="category" id="category">
              <option value="">Catégorie</option>
              {listCategories?.map((category: string, index: number) => (
                <option key={`CATEGORY INDEX ${index}`} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button onClick={() => setShowPromotion(!showPromotion)} className="button-promotion">
              Afficher les produit en promotion <span>{showPromotion ? 'ON' : 'OFF'}</span>
            </Button>
          </Container>
          <Container className="container-list-product-card">
            <h2>Produits</h2>
            <ul className="list-product-card">
              {filteredProducts?.map((product: Product, index: number) => (
                <li key={`PRODUCT INDEX ${index} - PRODUCT ID ${product.id}`}>
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    image={product.image}
                    category={product.category}
                    promotion={product.promotion}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </>
      )}
    </Layout>
  );
}

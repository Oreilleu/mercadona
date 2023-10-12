'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  // category: string;
  // promotion: boolean;
};

export default function Home() {
  const [showPromotion, setShowPromotion] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productsData, setProductsData] = useState([]);

  // const listProuct: string[] = productsData.map((product: Product) => product.name);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch('https://localhost:7208/api/ProductControllers/GetAll');
        if (response.ok) {
          const data = await response.json();
          setProductsData(data.data);
        } else {
          console.error("Une erreur s'est produite lors de la récupération des produits");
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des produits :", error);
      }
    };

    getProducts();
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
              <option value="Catégori 1">Catégori 1</option>
              <option value="Catégori 2">Catégori 2</option>
              <option value="Catégori 3">Catégori 3</option>
            </select>
            <Button onClick={() => setShowPromotion(!showPromotion)} className="button-promotion">
              Afficher les produit en promotion <span>{showPromotion ? 'ON' : 'OFF'}</span>
            </Button>
          </Container>
          <Container className="container-list-product-card">
            <h2>Produits</h2>
            <ul className="list-product-card">
              {productsData?.map((product: Product, index: number) => (
                <li key={`PRODUCT INDEX ${index} - PRODUCT ID ${product.id}`}>
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    image={product.image}
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

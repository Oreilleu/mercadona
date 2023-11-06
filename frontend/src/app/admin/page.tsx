'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import ModalHandle from '@/components/ModalHandle';
import ProductCard from '@/components/ProductCard';
import { filterproducts } from '@/utils/services';
import { Category, Product } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function Admin() {
  const router = useRouter();
  const [productsData, setProductsData] = useState();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>();
  const [listCategories, setListCategories] = useState<Category[]>();
  const [showPromotion, setShowPromotion] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!productsData) return;

    setFilteredProducts(filterproducts(productsData, selectedCategory, showPromotion));
  }, [productsData, selectedCategory, showPromotion]);

  useEffect(() => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      router.push('/connexion');
    }

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
          setListCategories(data.data);
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
    <Layout className="container-admin">
      <ModalHandle showModal={showModal} setShowModal={setShowModal} products={productsData} categories={listCategories} />

      <Banner title="Admin" />
      <Container className="container-button">
        {/* <Button>Gestion des administrateurs</Button> */}
        <Button onClick={() => setShowModal(true)}>Gestion categories</Button>
        <Button>Gestion des promotions</Button>
      </Container>
      <Container className="container-list-product-card">
        <h2>Produits</h2>
        <Container>
          <div className="container-button-filter">
            <select onChange={(e) => setSelectedCategory(e.target.value)} name="category" id="category">
              <option value="">Catégorie</option>
              {listCategories?.map(
                (category: Category, index: number) =>
                  category.products.length !== 0 && (
                    <option key={`CATEGORY INDEX ${index}`} value={category.name}>
                      {category.name}
                    </option>
                  )
              )}
            </select>
            <Button onClick={() => setShowPromotion(!showPromotion)} className="button-promotion">
              Afficher les produit en promotion <span>{showPromotion ? 'ON' : 'OFF'}</span>
            </Button>
          </div>
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
      </Container>
    </Layout>
  );
}

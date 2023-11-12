'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { filterproducts, getCategory, getProducts, getPromotions } from '@/utils/services';
import { Category, Product, Promotion } from '@/utils/types';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function Home() {
  const [showPromotion, setShowPromotion] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [listPromotions, setListPromotions] = useState<Promotion[]>([]);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!productsData) return;

    setFilteredProducts(filterproducts(productsData, selectedCategory, showPromotion));
  }, [productsData, selectedCategory, showPromotion]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products: Product[] | string = await getProducts();

      if (typeof products == 'string') {
        setError(products);
      } else {
        setProductsData(products);
      }
    };

    const fetchCategory = async () => {
      const category: Category[] | string = await getCategory();

      if (typeof category == 'string') {
        setError(category);
      } else {
        setListCategories(category);
      }
    };

    const fetchPromotions = async () => {
      const promotions: Promotion[] | string = await getPromotions();

      if (typeof promotions == 'string') {
        setError(promotions);
      } else {
        setListPromotions(promotions);
      }
    };

    fetchProducts();
    fetchCategory();
    fetchPromotions();
  }, []);

  return (
    <Layout className="container-homepage">
      <Banner title="Catalogue" />

      {error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <>
          {productsData?.length === 0 ? (
            <p className="text-center text-danger">Il n&apos;y a pas de produit à afficher</p>
          ) : (
            <>
              <Container className="container-button">
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
                        image={product.imageUrl}
                        category={product.category}
                        promotion={product.promotion}
                        categories={listCategories}
                        promotions={listPromotions}
                      />
                    </li>
                  ))}
                </ul>
              </Container>
            </>
          )}
        </>
      )}
    </Layout>
  );
}

'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import ModalCategory from '@/components/ModalCategory';
import ModalProduct from '@/components/ModalProduct';
import ModalPromotion from '@/components/ModalPromotion';
import ProductCard from '@/components/ProductCard';
import { filterproducts, getCategory, getProducts, getPromotions } from '@/utils/services';
import { Category, Product, Promotion } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function Admin() {
  const router = useRouter();
  const [productsData, setProductsData] = useState<Product[]>();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>();
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [listPromotions, setListPromotions] = useState<Promotion[]>([]);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [showModalPromotion, setShowModalPromotion] = useState(false);
  const [showModalProduct, setShowModalProduct] = useState(false);

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!productsData) return;

    setFilteredProducts(filterproducts(productsData, selectedCategory, showPromotion));
  }, [productsData, selectedCategory, showPromotion]);

  useEffect(() => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      router.push('/connexion');
    }

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
    <Layout className="container-admin">
      <ModalCategory
        showModalCategory={showModalCategory}
        setShowModalCategory={setShowModalCategory}
        categories={listCategories}
      />

      <ModalPromotion
        showModalPromotion={showModalPromotion}
        setShowModalPromotion={setShowModalPromotion}
        promotions={listPromotions}
      />

      <ModalProduct
        showModalProduct={showModalProduct}
        setShowModalProduct={setShowModalProduct}
        categories={listCategories}
        promotions={listPromotions}
      />

      <Banner title="Admin" />
      {error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <>
          <Container className="container-button">
            {/* <Button>Gestion des administrateurs</Button> */}
            <Button onClick={() => setShowModalCategory(true)}>Gestion categories</Button>
            <Button onClick={() => setShowModalPromotion(true)}>Gestion des promotions</Button>
            <Button onClick={() => setShowModalProduct(true)}>Ajouter un produit</Button>
          </Container>
          <Container className="container-list-product-card">
            <h2>Produits</h2>
            {productsData?.length === 0 ? (
              <p className="text-center text-danger mb-3">Il n'y a pas de produit à afficher pour le moment</p>
            ) : (
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
            )}
          </Container>
        </>
      )}
    </Layout>
  );
}
'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import ModalAdmin from '@/components/ModalAdmin';
import ModalCategory from '@/components/ModalCategory';
import ModalProduct from '@/components/ModalProduct';
import ModalPromotion from '@/components/ModalPromotion';
import ProductCard from '@/components/ProductCard';
import { filterproducts, getCategory, getProducts, getPromotions, getUsers, verifyToken } from '@/utils/services';
import { Category, Product, Promotion, User } from '@/utils/types';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function Admin() {
  const [productsData, setProductsData] = useState<Product[]>();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>();
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [listPromotions, setListPromotions] = useState<Promotion[]>([]);
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [showModalPromotion, setShowModalPromotion] = useState(false);
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [showModalAdmin, setShowModalAdmin] = useState(false);
  const [showModalProductCard, setShowModalProductCard] = useState<boolean>(false);

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!productsData) return;

    setFilteredProducts(filterproducts(productsData, selectedCategory, showPromotion));
  }, [productsData, selectedCategory, showPromotion]);

  useEffect(() => {
    verifyToken();

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

    const fetchUsers = async () => {
      const users: User[] | string = await getUsers();

      if (typeof users == 'string') {
        setError(users);
      } else {
        setListUsers(users);
      }
    };

    fetchProducts();
    fetchCategory();
    fetchPromotions();
    fetchUsers();
  }, [showModalProduct, showModalCategory, showModalPromotion, showModalAdmin, showModalProductCard]);

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

      <ModalAdmin showModalAdmin={showModalAdmin} setShowModalAdmin={setShowModalAdmin} users={listUsers} />

      <Banner title="Admin" />
      {error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <>
          <Container className="container-button">
            <Button onClick={() => setShowModalAdmin(true)}>Gestion des administrateurs</Button>
            <Button onClick={() => setShowModalCategory(true)}>Gestion categories</Button>
            <Button onClick={() => setShowModalPromotion(true)}>Gestion des promotions</Button>
            <Button onClick={() => setShowModalProduct(true)}>Ajouter un produit</Button>
          </Container>
          <Container className="container-list-product-card">
            <h2>Produits</h2>
            {productsData?.length === 0 ? (
              <p className="text-center text-danger mb-3">Il n&apos;y a pas de produit à afficher pour le moment</p>
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
                        categories={listCategories}
                        promotions={listPromotions}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        description={product.description}
                        image={product.imageUrl}
                        category={product.category}
                        promotion={product.promotion}
                        adminPanel
                        showModalProductCard={showModalProductCard}
                        setShowModalProductCard={setShowModalProductCard}
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

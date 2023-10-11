'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function Home({ products }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [showPromotion, setShowPromotion] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // console.log(products);

  return (
    <Layout className="container-homepage">
      <Banner title="Catalogue" />
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
        <ProductCard />
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const products = await res.json();

  console.log('JE SUIS DANS LE GETSTATICPROPS', products);

  return {
    props: {
      products,
    },
  };
}

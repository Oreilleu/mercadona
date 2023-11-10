import { Category, Promotion } from '@/utils/types';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import ModalProductCard from './ModalProductCard';

type ProductCardProps = {
  categories: Category[];
  promotions: Promotion[];
  id?: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  promotion: Promotion | null;
  adminPanel?: boolean;
};

export default function ProductCard({
  categories,
  promotions,
  id,
  name,
  price,
  description,
  image,
  category,
  promotion,
  adminPanel = false,
}: ProductCardProps) {
  const [manageButton, setManageButton] = useState<boolean>(false);

  if (!id) return null;

  return (
    <>
      {manageButton && (
        <ModalProductCard
          productId={id}
          showModalProductCard={manageButton}
          setShowModalProductCard={setManageButton}
          categories={categories}
          promotions={promotions}
          productName={name}
          productPrice={price}
          productDescription={description}
          productImage={image}
          productCategory={category}
          productPromotion={promotion}
        />
      )}
      <article className="container-product-card">
        {adminPanel && (
          <div className="container-button-admin-product">
            <Button onClick={() => setManageButton(!manageButton)}>Manage</Button>
          </div>
        )}

        <div className="container-img">
          <img src={image} alt="banner" />
        </div>

        <div className="content">
          <h3>{name}</h3>
          <p>Catégorie : {category.name}</p>
          {promotion && <p className="promotion">Promotion : {promotion.name}</p>}
          <p className={promotion ? 'price-promotion' : 'price'}>
            {promotion ? `${price - price * (promotion.discountPercentage / 100)} €` : `${price} €`}
          </p>
          <p className="description">{description}</p>
        </div>
      </article>
    </>
  );
}

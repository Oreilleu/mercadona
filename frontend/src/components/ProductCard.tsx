import { Category, Promotion } from '@/utils/types';

type ProductCardProps = {
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  promotion: Promotion | null;
};

export default function ProductCard({ name, price, description, image, category, promotion }: ProductCardProps) {
  return (
    <article className="container-product-card">
      <div className="container-img">
        <img src={image} alt="banner" />
      </div>
      <div className="content">
        <h3>{name}</h3>
        <p>Catégorie : {category.name}</p>
        {promotion && <p className="promotion">Promotion : {promotion.name}</p>}
        <p className={promotion ? 'price-promotion' : 'price'}>
          {promotion ? price - (price / promotion.discountPercentage) * 100 : price} €
        </p>
        <p className="description">{description}</p>
      </div>
    </article>
  );
}

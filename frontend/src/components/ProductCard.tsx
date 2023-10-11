export default function ProductCard() {
  return (
    <article className="container-product-card">
      <div className="container-img">
        <img src="https://www.mercadona.es/static/media/banner1@1x.a1cc528b6c06e1f281e1.jpg" alt="banner" />
      </div>
      <div className="content">
        <h3>Titre</h3>
        <p className="price">50 €</p>
        <p className="description">Une petite description qui ne dépasse pas 150 caractère je pense que c'est pas mal</p>
      </div>
    </article>
  );
}

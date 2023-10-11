type BannerProps = {
  title: string;
};

export default function Banner({ title }: BannerProps) {
  return (
    <div className="container-banner">
      <div className="container-img">
        <img src="https://www.mercadona.es/static/media/banner1@1x.a1cc528b6c06e1f281e1.jpg" alt="banner" />
      </div>
      <h1>{title}</h1>
    </div>
  );
}

type BannerProps = {
  title: string;
};

export default function Banner({ title }: BannerProps) {
  return (
    <div className="container-banner">
      <div className="container-img">
        <img src="./bannerMercadona.jpg" alt="Bannière de fruit et légume" />
      </div>
      <h1>{title}</h1>
    </div>
  );
}

import Image from 'next/image';

type BannerProps = {
  title: string;
};

export default function Banner({ title }: BannerProps) {
  return (
    <div className="container-banner">
      <div className="container-img">
        <Image src={'/bannerMercadona.webp'} alt="Bannière de fruit et légume" width={100} height={600} priority />
      </div>
      <h1>{title}</h1>
    </div>
  );
}

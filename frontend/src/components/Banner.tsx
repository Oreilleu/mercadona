import Image from 'next/image';

type BannerProps = {
  title: string;
};

export default function Banner({ title }: BannerProps) {
  return (
    <div className="container-banner">
      <div className="container-img">
        <Image src={'/bannerMercadona.jpg'} alt="Bannière de fruit et légume" width={1900} height={600} />
      </div>
      <h1>{title}</h1>
    </div>
  );
}

import Link from 'next/link';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="container-footer">
      <Container className="content">
        <p className="logo">Mercadona</p>
        <div className="container-link">
          <Link href="#">Plan du site</Link>
          <Link href="#">Mentions légales</Link>
          <Link href="#">Nous contacter</Link>
          <Link href="#">01 02 03 04 05</Link>
        </div>
      </Container>
    </footer>
  );
}

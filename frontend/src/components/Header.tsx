import { Container } from 'react-bootstrap';

export default function Header() {
  return (
    <Container as="header" className="container-header">
      <p className="logo">Mercadona</p>
      <button>Admin</button>
      {/* <p className="btn-promotion">Promotion</p> */}
    </Container>
  );
}

'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAdmin(document.cookie.includes('token'));
  }, []);

  const logout = () => {
    setIsAdmin(false);
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    router.refresh();
  };

  return (
    <Container as="header" className="container-header">
      <Link className="logo" href="/">
        Mercadona
      </Link>
      <button>
        {isAdmin ? (
          <Link href={'/'} onClick={() => logout()}>
            Déconnexion
          </Link>
        ) : (
          <Link href={'/connexion'}>Admin</Link>
        )}
      </button>
    </Container>
  );
}

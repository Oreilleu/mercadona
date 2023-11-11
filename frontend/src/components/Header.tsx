'use client';
import { verifyToken } from '@/utils/services';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const isValidToken = await verifyToken();
      if (isValidToken) {
        setIsAdmin(true);
      }
    };

    checkToken();
  }, []);

  const logout = () => {
    setIsAdmin(false);
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = '/';
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

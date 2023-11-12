'use client';
import Banner from '@/components/Banner';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

export default function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError('Identifiants incorrects');
        return;
      }

      const data = await response.json();
      const token = data.data;
      document.cookie = `token=${token}`;

      router.push('/admin');
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <Layout className="container-connexion">
      <Banner title="Connexion" />
      <Container className="content">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3 form-group">
            <Form.Label>Nom de compte</Form.Label>
            <Form.Control
              type="name"
              placeholder="Entrez votre nom de compte"
              className="input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="form-group">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez votre mot de passe"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Se connecter
          </Button>
        </Form>
      </Container>
    </Layout>
  );
}

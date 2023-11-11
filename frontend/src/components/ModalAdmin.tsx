import { deleteData, postData } from '@/utils/services';
import { CreateUser, User } from '@/utils/types';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type ModalHandleProps = {
  showModalAdmin: boolean;
  setShowModalAdmin: (value: boolean) => void;
  users: User[];
};

export default function ModalAdmin({ showModalAdmin, setShowModalAdmin, users }: ModalHandleProps) {
  const [error, setError] = useState<string>('');
  const [handleTab, setHandleTab] = useState<'add' | 'edit'>('edit');
  const [user, setUser] = useState<CreateUser>({
    username: '',
    password: '',
  });

  const handleClose = () => {
    setShowModalAdmin(false);
    setError('');
  };

  const handleAddClick = () => {
    setHandleTab('add');
    setShowModalAdmin(true);
    setError('');
  };

  const handleEditClick = () => {
    setHandleTab('edit');
    setShowModalAdmin(true);
    setError('');
  };

  const addUser = async (newUser: CreateUser) => {
    setError('');
    const specialCharactersRegex = /^[a-zA-Z0-9_]+$/;
    const charToAvoidPassword = /^[^\s!#$%^&()_+={}\[\]:;<>,.?\\|]+$/g;

    if (newUser.username === '' || newUser.password === '') {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!specialCharactersRegex.test(newUser.username)) {
      setError("Le nom d'utilisateur ne doit pas contenir de caractère spéciaux");
      return;
    }

    if (newUser.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!charToAvoidPassword.test(newUser.password)) {
      setError(
        'Le mot de passe ne peut pas contenir les caractère spéciaux suivant : ! # $ % ^ & ( ) _ + = { } [ ] : ; < > , . ? \\ |'
      );
      return;
    }

    if (newUser.password === newUser.username) {
      setError("Le mot de passe ne peut pas être identique au nom d'utilisateur");
      return;
    }

    const data = await postData('https://localhost:7208/Auth/Register', newUser);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('Administrateur créer');
      window.location.reload();
    } else {
      setError(data.message);
    }
  };

  const deleteUser = async (id: number) => {
    setError('');
    const data = await deleteData('https://localhost:7208/Auth', id);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('Administrateur supprimé');
      window.location.reload();
    } else {
      setError(data.message);
    }
  };

  return (
    <>
      <Modal show={showModalAdmin} onHide={handleClose} className="container-modal">
        <Modal.Header closeButton>
          <Modal.Title>Gestion des Administrateurs</Modal.Title>
          <div className="container-button">
            <Button variant="primary" className="me-3" onClick={handleEditClick}>
              Liste
            </Button>
            <Button variant="primary" className="me-3" onClick={handleAddClick}>
              Ajouter
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {handleTab === 'edit' && (
            <>
              {users.length === 1 && <p>Pas encore d'adinistrateur</p>}
              {error && <p className="text-center text-danger">{error}</p>}
              <ul className="list-unstyled">
                {users?.map(
                  (user: User) =>
                    !user.isInitialAccount && (
                      <li key={user.id} className="d-flex align-items-center gap-3">
                        <p>Administrateur : </p>
                        <p>{user.username}</p>
                        <Button variant="primary" onClick={() => deleteUser(user.id)}>
                          Supprimer
                        </Button>
                      </li>
                    )
                )}
              </ul>
            </>
          )}

          {handleTab === 'add' && (
            <Form>
              {error && <p className="text-center text-danger">{error}</p>}
              <Form.Group controlId="username-form">
                <Form.Label>Username : </Form.Label>
                <Form.Control type="text" onChange={(e) => setUser({ ...user, username: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="username-form">
                <Form.Label>Mot de passe : </Form.Label>
                <Form.Control type="password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
              </Form.Group>
              <Button className="mt-3" onClick={() => addUser(user)}>
                Envoyer
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
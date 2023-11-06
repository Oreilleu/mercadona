import { Category, Product } from '@/utils/types';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

type ModalHandleProps = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  products: Product[] | undefined;
  categories: Category[] | undefined;
};

export default function ModalHandle({ showModal, setShowModal, products, categories }: ModalHandleProps) {
  const [formType, setFormType] = useState<'add' | 'edit'>('edit');
  const [selectedIdCategory, setSelectedIdCategory] = useState<number | undefined>(undefined);
  const [updateCategory, setUpdateCategory] = useState<Category | undefined>();
  const [newCategory, setNewCategory] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAddClick = () => {
    setFormType('add');
    setShowModal(true);
  };

  const handleEditClick = () => {
    setFormType('edit');
    setShowModal(true);
  };

  const handleClose = () => {
    setFormType('edit');
    setShowModal(false);
  };

  const modifyCategory = async (newCategory: Category) => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      console.error('Vous devez être connecté pour modifier une catégorie');
    }

    try {
      const response = await fetch('https://localhost:7208/api/Category', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: newCategory.id, name: newCategory.name }),
      });

      if (response.ok) {
        console.log('La catégorie a bien été modifiée');
        window.location.reload();
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la modification de la catégorie :", error);
    }
  };

  const deleteCategory = async (id: number) => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      console.error('Vous devez être connecté pour modifier une catégorie');
    }

    try {
      const response = await fetch(`https://localhost:7208/api/Category/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        console.log('La catégorie a bien été supprimée');
        window.location.reload();
      } else {
        console.error('Les données demandées ne sont pas disponibles.');
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression du produit :", error);
    }
  };

  const addCategory = async (name: string) => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      console.error('Vous devez être connecté pour modifier une catégorie');
    }

    if (!name) {
      setError('Veuillez renseigner un nom de catégorie');
      return;
    }

    try {
      const response = await fetch('https://localhost:7208/api/Category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        console.log('La catégorie a bien été ajoutée');
        window.location.reload();
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de la catégorie :", error);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose} className="container-modal">
        <Modal.Header closeButton>
          <Modal.Title>Gestion catégorie</Modal.Title>
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
          {formType === 'edit' && (
            <ul className="list-unstyled">
              {categories?.map((category: Category) => {
                return (
                  <li key={category.id} className="mb-3">
                    {category.name} :{' '}
                    {category.name === 'Autre' ? (
                      'La catégorie ne peut pas être modifier'
                    ) : (
                      <>
                        {selectedIdCategory === category.id && (
                          <div className="container-input">
                            <input
                              type="text"
                              onChange={(e) =>
                                setUpdateCategory({ id: category.id, name: e.target.value, products: category.products })
                              }
                              disabled={!(selectedIdCategory === category.id)}
                            />
                            <Button type="submit" onClick={() => updateCategory && modifyCategory(updateCategory)}>
                              Modifier
                            </Button>
                            <p
                              className="cross"
                              onClick={() => {
                                setSelectedIdCategory(undefined);
                                setUpdateCategory(undefined);
                              }}
                            >
                              &times;
                            </p>
                          </div>
                        )}

                        {!selectedIdCategory && (
                          <>
                            {' '}
                            <Button className="button-modify" size="sm" onClick={() => setSelectedIdCategory(category.id)}>
                              Modifier
                            </Button>{' '}
                            -{' '}
                            <Button className="button-delete" size="sm" onClick={() => deleteCategory(category.id)}>
                              Supprimer
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {formType === 'add' && (
            <div className="container-input-add-category">
              {error && <p className="error">{error}</p>}
              <label>Nom de la catégorie : </label>
              <input type="text" onChange={(e) => setNewCategory(e.target.value)} />
              <Button onClick={() => addCategory(newCategory)}>Créer</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

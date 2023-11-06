import { Category, Product } from '@/utils/types';
import { useRouter } from 'next/navigation';
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
  const [newCategory, setNewCategory] = useState<Category | undefined>();

  const router = useRouter();

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
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        console.log('La catégorie a bien été modifiée');
        window.location.reload();
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la modification de la catégorie :", error);
    }
  };

  console.log('categories', categories);

  console.log('products', products);

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
                              onChange={(e) => setNewCategory({ id: category.id, name: e.target.value })}
                              disabled={!(selectedIdCategory === category.id)}
                            />
                            <Button type="submit" onClick={() => newCategory && modifyCategory(newCategory)}>
                              Modifier
                            </Button>
                            <p
                              className="cross"
                              onClick={() => {
                                setSelectedIdCategory(undefined);
                                setNewCategory(undefined);
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
                            <Button className="button-delete" size="sm">
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
          {formType === 'add' && <div>Formulaire pour ajouter une catégorie</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

import { deleteData, postData, putData } from '@/utils/services';
import { Category, Response } from '@/utils/types';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type ModalHandleProps = {
  showModalCategory: boolean;
  setShowModalCategory: (value: boolean) => void;
  categories: Category[] | undefined;
};

export default function ModalCategory({ showModalCategory, setShowModalCategory, categories }: ModalHandleProps) {
  const [formType, setFormType] = useState<'add' | 'edit'>('edit');
  const [selectedIdCategory, setSelectedIdCategory] = useState<number | undefined>(undefined);
  const [updateCategory, setUpdateCategory] = useState<Category | undefined>();
  const [newCategory, setNewCategory] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAddClick = () => {
    setFormType('add');
    setShowModalCategory(true);
    setError('');
  };

  const handleEditClick = () => {
    setFormType('edit');
    setShowModalCategory(true);
    setError('');
  };

  const handleClose = () => {
    setFormType('edit');
    setShowModalCategory(false);
    setError('');
  };

  const modifyCategory = async (newCategory: Category | undefined, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (!newCategory?.name) {
      setError('Veuillez renseigner un nom de catégorie');
      return;
    }

    const data: Response | string = await putData(`${process.env.NEXT_PUBLIC_API_URL}/api/Category`, {
      id: newCategory.id,
      name: newCategory.name,
    });

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La catégorie a bien été modifier');
      setShowModalCategory(false);
      setError('');
    } else {
      setError(data.message);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!id) {
      setError('Erreur lors de la suppression de la catégorie');
      return;
    }

    const data: Response | string = await deleteData(`${process.env.NEXT_PUBLIC_API_URL}/api/Category`, id);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La catégorie a bien été supprimer');
      setShowModalCategory(false);
      setError('');
    } else {
      setError(data.message);
    }
  };

  const addCategory = async (name: string) => {
    if (!name) {
      setError('Veuillez renseigner un nom de catégorie');
      return;
    }

    const data: Response | string = await postData(`${process.env.NEXT_PUBLIC_API_URL}/api/Category`, { name });

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La catégorie a bien été ajoutée');
      setShowModalCategory(false);
      setError('');
    } else {
      setError(data.message);
    }
  };

  return (
    <>
      <Modal show={showModalCategory} onHide={handleClose} className="container-modal">
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
              {error && <p className="text-danger">{error}</p>}
              {categories?.map((category: Category) => {
                return (
                  <li key={category.id} className="mb-3">
                    {category.name} :{' '}
                    {category.name === 'Autre' ? (
                      'La catégorie ne peut pas être modifier'
                    ) : (
                      <>
                        {selectedIdCategory === category.id && (
                          <Form className="container-input">
                            <div className="container-item">
                              <Form.Group controlId="name-form-category">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                  type="text"
                                  onChange={(e) =>
                                    setUpdateCategory({ id: category.id, name: e.target.value, products: category.products })
                                  }
                                ></Form.Control>
                              </Form.Group>
                              <Button type="submit" onClick={(event) => modifyCategory(updateCategory, event)}>
                                Modifier
                              </Button>
                              <p
                                className="cross-category"
                                onClick={() => {
                                  setSelectedIdCategory(undefined);
                                  setUpdateCategory(undefined);
                                }}
                              >
                                &times;
                              </p>
                            </div>
                          </Form>
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
            <Form className="container-input-add-category">
              {error && <p className="text-center text-danger">{error}</p>}
              <Form.Group controlId="name-form-category">
                <Form.Label>Nom de la catégorie : </Form.Label>
                <Form.Control type="text" onChange={(e) => setNewCategory(e.target.value)} />
              </Form.Group>
              <Button onClick={() => addCategory(newCategory)}>Créer</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

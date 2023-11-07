import { deleteData, postData, putData } from '@/utils/services';
import { Category, Product, Response } from '@/utils/types';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

type ModalHandleProps = {
  showModalCategory: boolean;
  setShowModalCategory: (value: boolean) => void;
  products: Product[] | undefined;
  categories: Category[] | undefined;
};

export default function ModalCategory({ showModalCategory, setShowModalCategory, products, categories }: ModalHandleProps) {
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

  const modifyCategory = async (newCategory: Category | undefined) => {
    if (!newCategory?.name) {
      setError('Veuillez renseigner un nom de catégorie');
      return;
    }

    const data: Response | string = await putData('https://localhost:7208/api/Category', {
      id: newCategory.id,
      name: newCategory.name,
    });

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La catégorie a bien été modifier');
      window.location.reload();
    } else {
      setError(data.message);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!id) {
      setError('Erreur lors de la suppression de la catégorie');
      return;
    }

    const data: Response | string = await deleteData('https://localhost:7208/api/Category', id);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La catégorie a bien été supprimer');
      window.location.reload();
    } else {
      setError(data.message);
    }
  };

  const addCategory = async (name: string) => {
    if (!name) {
      setError('Veuillez renseigner un nom de catégorie');
      return;
    }

    const data: Response | string = await postData('https://localhost:7208/api/Category', { name });

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La catégorie a bien été ajoutée');
      window.location.reload();
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
                          <div className="container-input">
                            <input
                              type="text"
                              onChange={(e) =>
                                setUpdateCategory({ id: category.id, name: e.target.value, products: category.products })
                              }
                              disabled={!(selectedIdCategory === category.id)}
                            />
                            <Button type="submit" onClick={() => modifyCategory(updateCategory)}>
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
              {error && <p className="text-center text-danger">{error}</p>}
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

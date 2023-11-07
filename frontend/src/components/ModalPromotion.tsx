import { Category, Product, Promotion } from '@/utils/types';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

type ModalHandleProps = {
  showModalPromotion: boolean;
  setShowModalPromotion: (value: boolean) => void;
  products: Product[] | undefined;
  promotions?: Category[] | undefined;
};

export default function ModalPromotion({ showModalPromotion, setShowModalPromotion, promotions }: ModalHandleProps) {
  const [formType, setFormType] = useState<'add' | 'edit'>('edit');
  const [selectedIdCategory, setSelectedIdCategory] = useState<number | undefined>(undefined);
  const [updateCategory, setUpdateCategory] = useState<Category | undefined>();
  const [newPromotion, setNewPromotion] = useState<Promotion>({
    name: '',
    startingDate: '',
    endingDate: '',
    discountPercentage: 0,
  });

  const [error, setError] = useState<string>('');

  const handleAddClick = () => {
    setFormType('add');
    setShowModalPromotion(true);
    setError('');
  };

  const handleEditClick = () => {
    setFormType('edit');
    setShowModalPromotion(true);
    setError('');
  };

  const handleClose = () => {
    setFormType('edit');
    setShowModalPromotion(false);
    setError('');
  };

  const modifyPromotion = async (newPromotion: Promotion) => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      console.error('Vous devez être connecté pour modifier une promotion');
    }

    try {
      const response = await fetch('https://localhost:7208/api/PromotionControllers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: newPromotion.id, name: newPromotion.name }),
      });

      if (response.ok) {
        console.log('La promotion a bien été modifiée');
        window.location.reload();
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la modification de la promotion :", error);
    }
  };

  const deletePromotion = async (id: number) => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      console.error('Vous devez être connecté pour modifier une promotion');
    }

    try {
      const response = await fetch(`https://localhost:7208/api/PromotionControllers/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        console.log('La promotion a bien été supprimée');
        window.location.reload();
      } else {
        console.error('Les données demandées ne sont pas disponibles.');
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de la promotion :", error);
    }
  };

  const addPromotion = async (newPromotion: Promotion) => {
    const token = document.cookie.split('=')[1];

    if (!token) {
      console.error('Vous devez être connecté pour modifier une promotion');
    }

    if (!newPromotion.name || !newPromotion.startingDate || !newPromotion.endingDate || !newPromotion.discountPercentage) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPromotion.discountPercentage < 0 || newPromotion.discountPercentage > 80) {
      setError('La remise doit être comprise entre 0 et 80 %');
      return;
    }

    console.log('newPromotion', newPromotion);

    try {
      const response = await fetch('https://localhost:7208/api/PromotionControllers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newPromotion),
      });

      console.log(await response.json());

      if (response.ok) {
        console.log('La promotion a bien été ajoutée');
        // window.location.reload();
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de la promotion :", error);
    }
  };

  return (
    <>
      <Modal show={showModalPromotion} onHide={handleClose} className="container-modal">
        <Modal.Header closeButton>
          <Modal.Title>Gestion Promotion</Modal.Title>
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
          {/* {formType === 'edit' && (
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
          )} */}
          {formType === 'add' && (
            <div className="container-input-add-promotion">
              {error && <p className="error">{error}</p>}
              <label>Nom de la Promotion : </label>
              <input type="text" onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })} />
              <label>Date de début : </label>
              <input type="date" onChange={(e) => setNewPromotion({ ...newPromotion, startingDate: e.target.value })} />
              <label>Date de fin: </label>
              <input type="date" onChange={(e) => setNewPromotion({ ...newPromotion, endingDate: e.target.value })} />
              <label>Remise : </label>
              <input
                type="text"
                onChange={(e) => setNewPromotion({ ...newPromotion, discountPercentage: parseInt(e.target.value) })}
              />
              <Button onClick={() => addPromotion(newPromotion)}>Créer</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

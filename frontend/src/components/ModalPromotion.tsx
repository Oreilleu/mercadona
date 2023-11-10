import { postData, putData } from '@/utils/services';
import { Promotion, Response } from '@/utils/types';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

type ModalHandleProps = {
  showModalPromotion: boolean;
  setShowModalPromotion: (value: boolean) => void;
  promotions: Promotion[] | undefined;
};

export default function ModalPromotion({ showModalPromotion, setShowModalPromotion, promotions }: ModalHandleProps) {
  const [formType, setFormType] = useState<'add' | 'edit'>('edit');
  const [selectedIdPromotion, setSelectedIdPromotion] = useState<number | undefined>(undefined);
  const [updatePromotion, setUpdatePromotion] = useState<Promotion>({
    id: 0,
    name: '',
    startingDate: '',
    endingDate: '',
    discountPercentage: 0,
  });

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
    console.log(newPromotion);
    if (!newPromotion.name || !newPromotion.startingDate || !newPromotion.endingDate || !newPromotion.discountPercentage) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPromotion.discountPercentage < 0 || newPromotion.discountPercentage > 80) {
      setError('La remise doit être comprise entre 0 et 80 %');
      return;
    }

    const data: Response | string = await putData('https://localhost:7208/api/PromotionControllers', newPromotion);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La promotion a bien été ajoutée');
      window.location.reload();
    } else {
      setError(data.message);
    }
  };

  const deletePromotion = async (id: number) => {
    if (!id) {
      setError('Erreur lors de la suppression de la catégorie');
      return;
    }

    const data: Response | string = await postData('https://localhost:7208/api/PromotionControllers', id);

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

  const addPromotion = async (newPromotion: Promotion) => {
    if (!newPromotion.name || !newPromotion.startingDate || !newPromotion.endingDate || !newPromotion.discountPercentage) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPromotion.discountPercentage < 0 || newPromotion.discountPercentage > 80) {
      setError('La remise doit être comprise entre 0 et 80 %');
      return;
    }

    const data: Response | string = await postData('https://localhost:7208/api/PromotionControllers', newPromotion);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La promotion a bien été ajoutée');
      window.location.reload();
    } else {
      setError(data.message);
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
          {formType === 'edit' && (
            <ul className="list-unstyled">
              {promotions?.map((promotion: Promotion) => {
                const handlePromotionClick = () => {
                  setUpdatePromotion({
                    id: promotion.id,
                    name: promotion.name,
                    startingDate: promotion.startingDate,
                    endingDate: promotion.endingDate,
                    discountPercentage: promotion.discountPercentage,
                  });
                };
                return (
                  <li key={promotion.id} className="mb-3" onClick={() => handlePromotionClick()}>
                    {promotion.name} :{' '}
                    {promotion.name === 'Autre' ? (
                      'La catégorie ne peut pas être modifier'
                    ) : (
                      <>
                        {error && <p className="text-danger">{error}</p>}
                        {selectedIdPromotion === promotion.id && (
                          <div className="container-input">
                            <div className="container-item">
                              <label htmlFor="update-name-promotion">Nom</label>
                              <input
                                type="text"
                                disabled={!(selectedIdPromotion === promotion.id)}
                                value={updatePromotion.name}
                                onChange={(e) => setUpdatePromotion({ ...updatePromotion, name: e.target.value })}
                                id="update-name-promotion"
                              />
                            </div>
                            <div className="container-item">
                              <label htmlFor="update-start-date-promotion">Date de début</label>
                              <input
                                type="date"
                                disabled={!(selectedIdPromotion === promotion.id)}
                                value={updatePromotion.startingDate}
                                onChange={(e) => setUpdatePromotion({ ...updatePromotion, startingDate: e.target.value })}
                                id="update-start-date-promotion"
                              />
                            </div>
                            <div className="container-item">
                              <label htmlFor="update-end-date-promotion">Date de fin</label>
                              <input
                                type="date"
                                disabled={!(selectedIdPromotion === promotion.id)}
                                value={updatePromotion.endingDate}
                                onChange={(e) => setUpdatePromotion({ ...updatePromotion, endingDate: e.target.value })}
                                id="update-end-date-promotion"
                              />
                            </div>
                            <div className="container-item">
                              <label htmlFor="update-discount-promotion">Remise</label>
                              <input
                                type="number"
                                disabled={!(selectedIdPromotion === promotion.id)}
                                value={updatePromotion.discountPercentage || 0}
                                onChange={(e) =>
                                  setUpdatePromotion({
                                    ...updatePromotion,
                                    discountPercentage: parseInt(e.target.value || '0'),
                                  })
                                }
                                id="update-discount-promotion"
                              />
                            </div>
                            <Button type="submit" onClick={() => modifyPromotion(updatePromotion)}>
                              Modifier
                            </Button>
                            <p
                              className="cross-promotion"
                              onClick={() => {
                                setSelectedIdPromotion(undefined);
                                setUpdatePromotion({
                                  id: 0,
                                  name: '',
                                  startingDate: '',
                                  endingDate: '',
                                  discountPercentage: 0,
                                });
                              }}
                            >
                              &times;
                            </p>
                          </div>
                        )}

                        {!selectedIdPromotion && (
                          <>
                            {' '}
                            <Button className="button-modify" size="sm" onClick={() => setSelectedIdPromotion(promotion.id)}>
                              Modifier
                            </Button>{' '}
                            -{' '}
                            <Button
                              className="button-delete"
                              size="sm"
                              onClick={() => promotion.id && deletePromotion(promotion.id)}
                            >
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
            <div className="container-input-add-promotion">
              {error && <p className="text-danger">{error}</p>}
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

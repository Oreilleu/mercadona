import { deleteData, postData, putData } from '@/utils/services';
import { Promotion, Response } from '@/utils/types';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

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

  const modifyPromotion = async (newPromotion: Promotion, event: React.MouseEvent) => {
    event.preventDefault();
    const startingDate = new Date(newPromotion.startingDate).toLocaleDateString();
    const endingDate = new Date(newPromotion.endingDate).toLocaleDateString();

    if (!newPromotion.name || !newPromotion.startingDate || !newPromotion.endingDate || !newPromotion.discountPercentage) {
      if (Number.isNaN(newPromotion.discountPercentage)) {
        setError('Veuillez renseigner une remise valide');
        return;
      }
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPromotion.discountPercentage < 0 || newPromotion.discountPercentage > 80) {
      return setError('La remise doit être comprise entre 0 et 80 %');
    }

    if (startingDate > endingDate) {
      setError('La date de début doit être inférieur à la date de fin');
      return;
    }

    const data: Response | string = await putData(`${process.env.NEXT_PUBLIC_API_URL}/api/PromotionControllers`, newPromotion);

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

    const data: Response | string = await deleteData(`${process.env.NEXT_PUBLIC_API_URL}/api/PromotionControllers`, id);

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
    const startingDate = new Date(newPromotion.startingDate).toLocaleDateString();
    const endingDate = new Date(newPromotion.endingDate).toLocaleDateString();

    if (!newPromotion.name || !newPromotion.startingDate || !newPromotion.endingDate || !newPromotion.discountPercentage) {
      if (Number.isNaN(newPromotion.discountPercentage)) {
        setError('Veuillez renseigner une remise valide');
        return;
      }
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPromotion.discountPercentage < 0 || newPromotion.discountPercentage > 80) {
      setError('La remise doit être comprise entre 0 et 80 %');
      return;
    }

    if (startingDate > endingDate) {
      setError('La date de début doit être inférieur à la date de fin');
      return;
    }

    const data: Response | string = await postData(`${process.env.NEXT_PUBLIC_API_URL}/api/PromotionControllers`, newPromotion);

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
                          <Form className="container-input">
                            <Form.Group className="container-item" controlId="update-name-promotion">
                              <Form.Label>Nom</Form.Label>
                              <Form.Control
                                type="text"
                                value={updatePromotion.name}
                                onChange={(e) => setUpdatePromotion({ ...updatePromotion, name: e.target.value })}
                              />
                            </Form.Group>
                            <Form.Group className="container-item" controlId="update-start-date-promotion">
                              <Form.Label>Date de début</Form.Label>
                              <Form.Control
                                type="date"
                                value={updatePromotion.startingDate}
                                onChange={(e) => setUpdatePromotion({ ...updatePromotion, startingDate: e.target.value })}
                              />
                            </Form.Group>
                            <Form.Group className="container-item" controlId="update-end-date-promotion">
                              <Form.Label>Date de fin</Form.Label>
                              <Form.Control
                                type="date"
                                value={updatePromotion.endingDate}
                                onChange={(e) => setUpdatePromotion({ ...updatePromotion, endingDate: e.target.value })}
                              />
                            </Form.Group>
                            <Form.Group className="container-item" controlId="update-discount-promotion">
                              <Form.Label>Remise</Form.Label>
                              <Form.Control
                                type="number"
                                value={updatePromotion.discountPercentage || ''}
                                onChange={(e) =>
                                  setUpdatePromotion({
                                    ...updatePromotion,
                                    discountPercentage: parseInt(e.target.value || '0'),
                                  })
                                }
                              />
                            </Form.Group>
                            <Button type="submit" onClick={(event) => modifyPromotion(updatePromotion, event)}>
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
                          </Form>
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
            <Form className="container-input-add-promotion">
              {error && <p className="text-danger">{error}</p>}
              <Form.Group controlId="name-add-modal-promotion">
                <Form.Label>Nom de la Promotion : </Form.Label>
                <Form.Control type="text" onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="name-startDate-modal-promotion">
                <Form.Label>Date de début : </Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setNewPromotion({ ...newPromotion, startingDate: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="name-endDate-modal-promotion">
                <Form.Label>Date de fin: </Form.Label>
                <Form.Control type="date" onChange={(e) => setNewPromotion({ ...newPromotion, endingDate: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="name-discount-modal-promotion">
                <Form.Label>Remise : </Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setNewPromotion({ ...newPromotion, discountPercentage: parseInt(e.target.value) })}
                />
              </Form.Group>
              <Button onClick={() => addPromotion(newPromotion)}>Créer</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

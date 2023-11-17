import { deleteData, postFormData, putData } from '@/utils/services';
import { Category, Promotion, Response, UpdateProduct } from '@/utils/types';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type ModalProductCardProps = {
  showModalProductCard: boolean;
  setShowModalProductCard: (value: boolean) => void;
  categories: Category[];
  promotions: Promotion[];
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productCategory: Category;
  productPromotion: Promotion | null;
};

export default function ModalProductCard({
  showModalProductCard,
  setShowModalProductCard,
  categories,
  promotions,
  productId,
  productName,
  productDescription,
  productPrice,
  productCategory,
  productPromotion,
}: ModalProductCardProps) {
  const [handleTab, setHandleTab] = useState<'put' | 'delete'>('put');
  const [imageFile, setImageFile] = useState<File>();
  const [error, setError] = useState<string>('');

  const [product, setProduct] = useState<UpdateProduct>({
    id: productId,
    name: productName,
    price: productPrice,
    description: productDescription,
    categoryId: productCategory.id,
    promotionId: productPromotion?.id,
  });

  const handlePutClick = () => {
    setHandleTab('put');
    setShowModalProductCard(true);
    setError('');
  };

  const handleDeleteClick = () => {
    setHandleTab('delete');
    setShowModalProductCard(true);
    setError('');
  };

  const handleClose = () => {
    setShowModalProductCard(false);
  };

  const updateproduct = async (newProduct: UpdateProduct) => {
    if (!product.name || !product.price || !product.description) {
      if (Number.isNaN(newProduct.price)) {
        setError('Veuillez renseigner un prix valide');
        return;
      }
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (
      imageFile &&
      imageFile.type !== 'image/png' &&
      imageFile.type !== 'image/jpeg' &&
      imageFile.type !== 'image/jpg' &&
      imageFile.type !== 'image/webp'
    ) {
      setError('Veuillez sélectionner une image au format PNG, JPEG, JPG ou WEBP');
      return;
    }

    const data: Response | string = await putData(`${process.env.NEXT_PUBLIC_API_URL}/api/ProductControllers`, newProduct);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('Le produit a bien été modifier');

      if (!imageFile) {
        return setShowModalProductCard(false);
      }

      const formData = new FormData();
      formData.append('imageFile', imageFile);
      formData.append('idProduct', `${data.data.id}`);

      const dataImage: Response | string = await postFormData(`${process.env.NEXT_PUBLIC_API_URL}/api/UploadImage`, formData);
      if (typeof dataImage === 'string') {
        setError(dataImage);
        return;
      }

      if (dataImage.success) {
        console.log('Image ajoutée');
        setShowModalProductCard(false);
        setError('');
      } else {
        setError(dataImage.message);
        return;
      }
    } else {
      setError(data.message);
      return;
    }
  };

  const deleteProduct = async (id: number) => {
    if (!id) {
      setError('Erreur lors de la suppression de la catégorie');
      return;
    }

    const data: Response | string = await deleteData(`${process.env.NEXT_PUBLIC_API_URL}/api/ProductControllers`, id);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('La catégorie a bien été supprimer');
      setShowModalProductCard(false);
    } else {
      setError(data.message);
    }
  };

  return (
    <>
      <Modal show={showModalProductCard} onHide={handleClose} className="container-modal">
        <Modal.Header closeButton>
          <Modal.Title>{handleTab === 'put' ? 'Modifier' : 'Supprimer'} un produit</Modal.Title>
          <div>
            <Button variant="primary" className="me-3" onClick={handlePutClick}>
              Modifier
            </Button>
            <Button variant="primary" className="me-3" onClick={handleDeleteClick}>
              Supprimer
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {handleTab === 'put' && (
            <Form>
              {error && <p className="text-center text-danger">{error}</p>}
              <Form.Group className="mb-3" controlId="name-product-card">
                <Form.Label>Nom du produit</Form.Label>
                <Form.Control
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description-product-card">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="price-product-card">
                <Form.Label>Prix</Form.Label>
                <Form.Control
                  type="number"
                  value={product.price || ''}
                  onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="image-product-card">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    const inputElement = e.target as HTMLInputElement;
                    if (inputElement.files === null) {
                      setError('Aucunne image selectioner');
                      return;
                    }
                    setImageFile(inputElement.files[0]);
                  }}
                />
              </Form.Group>
              {categories.length !== 1 && (
                <Form.Group className="mb-3" controlId="category-form-control">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setProduct({ ...product, categoryId: parseInt(e.target.value) })}
                  >
                    <option value={productCategory.id}>{productCategory.name}</option>
                    {categories.map(
                      (category: Category) =>
                        category.name !== productCategory.name && (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        )
                    )}
                  </Form.Select>
                </Form.Group>
              )}
              {promotions.length !== 0 && (
                <Form.Group className="mb-3" controlId="promotion-form-control">
                  <Form.Label>Promotion</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setProduct({ ...product, promotionId: parseInt(e.target.value) })}
                  >
                    <option value={productPromotion?.id}>{productPromotion?.name}</option>
                    {promotions.map(
                      (promotion: Promotion) =>
                        promotion.name !== productPromotion?.name && (
                          <option key={promotion.id} value={promotion.id}>
                            {promotion.name}
                          </option>
                        )
                    )}
                    {productPromotion && <option value={undefined}>Retirer promotion</option>}
                  </Form.Select>
                </Form.Group>
              )}
              <Button onClick={() => updateproduct(product)}>Modifier</Button>
            </Form>
          )}
          {handleTab === 'delete' && (
            <div>
              <p className="mb-3">Supprimer le produit ? </p>
              <Button onClick={() => deleteProduct(productId)}>Valider</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

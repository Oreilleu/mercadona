import { postData, postFormData } from '@/utils/services';
import { Category, CreateProduct, Promotion, Response } from '@/utils/types';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type ModalHandleProps = {
  showModalProduct: boolean;
  setShowModalProduct: (value: boolean) => void;
  categories: Category[];
  promotions: Promotion[];
};

export default function ModalProduct({ showModalProduct, setShowModalProduct, categories, promotions }: ModalHandleProps) {
  const [product, setProduct] = useState<CreateProduct>({
    name: '',
    price: 0,
    description: '',
    categoryId: undefined,
    promotionId: undefined,
  });
  const [imageFile, setImageFile] = useState<File>();
  const [error, setError] = useState<string>('');

  const handleClose = () => {
    setShowModalProduct(false);
    setError('');
  };

  const addProduct = async (newProduct: CreateProduct) => {
    if (!product.name || !product.price || !product.description || !imageFile) {
      if (Number.isNaN(newProduct.price)) {
        setError('Veuillez renseigner un prix valide');
        return;
      }

      setError('Veuillez remplir tous les champs');
      return;
    }

    if (
      imageFile.type !== 'image/png' &&
      imageFile.type !== 'image/jpeg' &&
      imageFile.type !== 'image/jpg' &&
      imageFile.type !== 'image/webp'
    ) {
      setError('Veuillez sélectionner une image au format PNG, JPEG, JPG ou WEBP');
      return;
    }

    const data: Response | string = await postData(`${process.env.NEXT_PUBLIC_API_URL}/api/ProductControllers`, newProduct);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('Le produit a bien été ajoutée');

      const formData = new FormData();
      formData.append('imageFile', imageFile);
      formData.append('idProduct', `${data.data[data.data.length - 1].id}`);

      const dataImage: Response | string = await postFormData(`${process.env.NEXT_PUBLIC_API_URL}/api/UploadImage`, formData);
      if (typeof dataImage === 'string') {
        setError(dataImage);
        return;
      }

      if (dataImage.success) {
        console.log('Image ajoutée');
        setShowModalProduct(false);
      } else {
        setError(dataImage.message);
        return;
      }
    } else {
      setError(data.message);
      return;
    }
  };

  return (
    <>
      <Modal show={showModalProduct} onHide={handleClose} className="container-modal">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-center text-danger">{error}</p>}
          <Form className="container-form-product" encType="multipart/form-data">
            <Form.Group className="container-input-product" controlId="name-product">
              <Form.Label>Nom du produit</Form.Label>
              <Form.Control type="text" onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="container-input-product" controlId="price-product">
              <Form.Label>Prix</Form.Label>
              <Form.Control type="text" onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) })} />
            </Form.Group>
            <Form.Group className="container-input-product" controlId="description-product">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="container-input-product" controlId="image-product">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files === null) {
                    setError('Aucunne image selectioner');
                    return;
                  }
                  setImageFile(target.files[0]);
                }}
              />
            </Form.Group>
            {categories.length !== 1 && (
              <Form.Group className="container-input-product" controlId="category-product">
                <Form.Select
                  className="my-3"
                  onChange={(e) => setProduct({ ...product, categoryId: parseInt(e.target.value) })}
                >
                  <option value={undefined}>Catégorie</option>
                  {categories?.map((category: Category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            {promotions.length !== 0 && (
              <Form.Group className="container-input-product mt-3" controlId="promotion-id">
                <Form.Select
                  className="mb-3"
                  onChange={(e) => setProduct({ ...product, promotionId: parseInt(e.target.value) })}
                >
                  <option value={undefined}> Sans Promotion</option>
                  {promotions.map((promotion: Promotion) => (
                    <option value={promotion.id} key={promotion.id}>
                      {promotion.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Button onClick={() => addProduct(product)} className="mt-3">
              Ajouter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

import { postFormData } from '@/utils/services';
import { Category, CreateProduct, Promotion, Response } from '@/utils/types';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

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
    imageFile: {} as File,
    categoryId: undefined,
    promotionId: undefined,
  });
  // const [imageFile, setImageFile] = useState<File>();
  const [error, setError] = useState<string>('');

  const handleClose = () => {
    setShowModalProduct(false);
    setError('');
  };

  const addProduct = async (newProduct: CreateProduct) => {
    if (!product.name || !product.price || !product.description || !product.imageFile) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (product.imageFile.type !== 'image/jpeg') {
      setError('Veuillez selectionner une image de type jpeg');
      return;
    }

    if (product.imageFile.size > 16384) {
      setError('Image trop grosse');
    }

    console.log(product.imageFile);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('description', product.description);
    formData.append('imageFile', product.imageFile);
    formData.append('categoryId', product.categoryId?.toString() || '');
    formData.append('promotionId', product.promotionId?.toString() || '');

    const data: Response | string = await postFormData('https://localhost:7208/api/ProductControllers', formData);

    if (typeof data === 'string') {
      setError(data);
      return;
    }

    if (data.success) {
      console.log('Le produit a bien été ajoutée');
      window.location.reload();
    } else {
      setError(data.message);
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
          <form className="container-form-product" encType="multipart/form-data">
            <div className="container-input-product">
              <label htmlFor="name-product">Nom du produit</label>
              <input type="text" id="name-product" onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            </div>
            <div className="container-input-product">
              <label htmlFor="name-product">Prix</label>
              <input
                type="text"
                id="name-product"
                onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) })}
              />
            </div>
            <div className="container-input-product">
              <label htmlFor="name-product">Description</label>
              <input type="text" id="name-product" onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </div>
            <div className="container-input-product">
              <label htmlFor="name-product">Image</label>
              <input
                type="file"
                id="name-product"
                onChange={(e) => {
                  if (e.target.files === null) {
                    setError('Aucunne image selectioner');
                    return;
                  }
                  setProduct({ ...product, imageFile: e.target.files[0] });
                  // setImageFile(e.target.files[0]);
                }}
              />
            </div>
            {categories.length !== 1 && (
              <div className="container-input-product">
                <select className="my-3" onChange={(e) => setProduct({ ...product, categoryId: parseInt(e.target.value) })}>
                  <option value={undefined}>Catégorie</option>
                  {categories?.map((category: Category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {promotions.length !== 0 && (
              <div className="container-input-product mt-3">
                <select className="mb-3" onChange={(e) => setProduct({ ...product, promotionId: parseInt(e.target.value) })}>
                  <option value={undefined}> Sans Promotion</option>
                  {promotions.map((promotion: Promotion) => (
                    <option value={promotion.id} key={promotion.id}>
                      {promotion.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button onClick={() => addProduct(product)} className="mt-3">
              Ajouter
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
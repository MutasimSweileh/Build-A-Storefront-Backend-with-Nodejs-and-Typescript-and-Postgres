import { Router, Request, Response, NextFunction } from 'express';
import { Products, Product } from '../models/Products';
import verifyAuthToken from '../middleware/authentication';
const product = new Products();
const router = Router();
const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await product.index();
    res.json({
      status: 'success',
      data: products
    });
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Product = await product.show(req.params.id);
    res.json({
      status: 'success',
      data: Product
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const newProduct = await product.create(Product);
    res.json({
      status: 'success',
      data: newProduct
    });
  } catch (err) {
    next(err);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const Product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const newProduct = await product.update(id, Product);
    res.json({
      status: 'success',
      data: newProduct
    });
  } catch (err) {
    next(err);
  }
};
const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await product.delete(req.params.id);
    res.json({
      status: 'success',
      data: deleted
    });
  } catch (err) {
    next(err);
  }
};
const productsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await product.productsByCategory(req.body.category);
    res.json({
      status: 'success',
      data: products
    });
  } catch (err) {
    next(err);
  }
};
router.get('/products', index);
router.get('/products/:id', show);
router.post('/product-by-category', productsByCategory);
router.post('/products', verifyAuthToken, create);
router.put('/products/:id', verifyAuthToken, update);
router.delete('/products/:id', verifyAuthToken, destroy);

export default router;

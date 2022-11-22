import { Router, Request, Response, NextFunction } from 'express';
import { Orders, Order } from '../models/Orders';
const order = new Orders();
const router = Router();
const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await order.index();
    res.json({
      status: 'success',
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Order = await order.show(req.params.id);
    res.json({
      status: 'success',
      data: Order
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Order: Order = {
      products: req.body.products,
      status: req.body.status,
      user_id: req.body.user_id
    };
    const newOrder = await order.create(Order);
    res.json({
      status: 'success',
      data: newOrder
    });
  } catch (err) {
    next(err);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const Order: Order = {
      status: req.body.status
    };
    const newOrder = await order.update(id, Order);
    res.json({
      status: 'success',
      data: newOrder
    });
  } catch (err) {
    next(err);
  }
};
const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await order.delete(req.params.id);
    res.json({
      status: 'success',
      data: deleted
    });
  } catch (err) {
    next(err);
  }
};
const addProduct = async (req: Request, res: Response) => {
  const orderId: string = req.params.id;
  const productId: string = req.body.productId;
  const quantity: number = parseInt(req.body.quantity);
  try {
    const addedProduct = await order.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const ordersByUserID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await order.getByUserId(req.params.id);
    res.json({
      status: 'success',
      data: orders
    });
  } catch (err) {
    next(err);
  }
};
router.get('/orders', index);
router.get('/orders/:id', show);
router.post('/orders', create);
router.put('/orders/:id', update);
router.delete('/orders/:id', destroy);
router.post('/orders/:id/product', addProduct);
router.get('/orders/user/:id', ordersByUserID);

export default router;

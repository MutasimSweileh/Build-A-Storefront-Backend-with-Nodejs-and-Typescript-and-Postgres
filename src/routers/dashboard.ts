import { Router, Request, Response, NextFunction } from 'express';
import { Dashboard } from '../services/dashboard';
const router = Router();
const dashboard = new Dashboard();

const productsInOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await dashboard.productsInOrders();
    res.json(products);
  } catch (err) {
    return next(err);
  }
};
const usersWithOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await dashboard.usersWithOrders();
    res.json(users);
  } catch (err) {
    return next(err);
  }
};
const fiveMostExpensive = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await dashboard.fiveMostExpensive();
    res.json(users);
  } catch (err) {
    return next(err);
  }
};
router.get('/products_in_orders', productsInOrders);
router.get('/users-with-orders', usersWithOrders);
router.get('/five-most-expensive', fiveMostExpensive);
export default router;

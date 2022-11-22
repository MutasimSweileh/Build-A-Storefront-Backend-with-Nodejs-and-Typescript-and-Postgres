import { Router, Request, Response } from 'express';
import { Dashboard } from '../services/dashboard';
const router = Router();
const dashboard = new Dashboard();

const productsInOrders = async (_req: Request, res: Response) => {
  const products = await dashboard.productsInOrders();
  res.json(products);
};
const usersWithOrders = async (_req: Request, res: Response) => {
  const users = await dashboard.usersWithOrders();
  res.json(users);
};
const fiveMostExpensive = async (_req: Request, res: Response) => {
  const users = await dashboard.fiveMostExpensive();
  res.json(users);
};
router.get('/products_in_orders', productsInOrders);
router.get('/users-with-orders', usersWithOrders);
router.get('/five-most-expensive', fiveMostExpensive);
export default router;

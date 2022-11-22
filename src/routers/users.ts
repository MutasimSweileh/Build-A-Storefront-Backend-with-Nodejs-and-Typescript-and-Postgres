import { Router, Request, Response, NextFunction } from 'express';
import { Users, User } from '../models/Users';
import jwt from 'jsonwebtoken';
import config from '../config';
const user = new Users();
const router = Router();
const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await user.index();
    res.json({
      status: 'success',
      data: users
    });
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const User = await user.show(req.params.id);
    res.json({
      status: 'success',
      data: User
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const User: User = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    };
    const newUser = await user.create(User);
    const token = jwt.sign({ u: newUser }, config.tokenSecret as unknown as string);
    res.json({
      status: 'success',
      data: { ...newUser, token }
    });
  } catch (err) {
    next(err);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const User: User = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname
    };
    const newUser = await user.update(id, User);
    res.json({
      status: 'success',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};
const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await user.delete(req.params.id);
    res.json({
      status: 'success',
      data: deleted
    });
  } catch (err) {
    next(err);
  }
};
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const u = await user.authenticate(username, password);
    const token = jwt.sign({ u }, config.tokenSecret as unknown as string);
    if (!u) {
      return res.status(401).json({
        status: 'error',
        message: 'the username and password do not match please try again'
      });
    }
    return res.json({
      status: 'success',
      data: { ...u, token },
      message: 'User authenticated successfully'
    });
  } catch (err) {
    return next(err);
  }
};
router.get('/users', index);
router.get('/users/:id', show);
router.post('/users', create);
router.put('/users/:id', update);
router.delete('/users/:id', destroy);
export default router;

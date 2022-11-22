import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
interface Error {
  status?: number;
  name?: string;
  message?: string;
  stack?: string;
}
const handleError = (next: NextFunction) => {
  const error: Error = new Error('Login Error, Please login again');
  error.status = 401;
  next(error);
};
const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return handleError(next);
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.tokenSecret as unknown as string);
    if (decoded) {
      next();
    } else {
      handleError(next);
    }
  } catch (error) {
    handleError(next);
  }
};

export default verifyAuthToken;

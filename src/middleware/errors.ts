import { Response, Request, NextFunction } from 'express';
interface Error {
  status?: number;
  name?: string;
  message?: string;
  stack?: string;
}
const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Whoops!! something went wrong';
  if (!res) next();
  else res.status(status).json({ status, message });
};

export default errorMiddleware;

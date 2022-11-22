import express, { Application } from 'express';
import errorMiddleware from './middleware/errors';
import verifyAuthToken from './middleware/authentication';
import usersRouter, { authenticate } from './routers/users';
import orderRouter from './routers/orders';
import productRouter from './routers/products';
import dashboardRouter from './routers/dashboard';
import helmet from 'helmet';
import morgan from 'morgan';
import debug from 'debug';
const d = debug('App');
//debug.enable('*');
const app: Application = express();
app.use(helmet());
app.use(morgan('dev'));
const port = process.env.PORT || 3000;
app.listen(port, () => d(`App is listening on port ${port}.`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/login', authenticate);
app.use('/', productRouter);
app.use('/', verifyAuthToken, usersRouter);
app.use('/', verifyAuthToken, orderRouter);
app.use('/dashboard', verifyAuthToken, dashboardRouter);
app.use(errorMiddleware);
export default app;

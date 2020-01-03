import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/user', UserController.save);
routes.post('/session', SessionController.authenticate);

export default routes;

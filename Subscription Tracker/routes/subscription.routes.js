import {Router} from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({title: 'GET all subscriptions!'});
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: 'GET upcoming renewals!'});
});

subscriptionRouter.get('/:id', (req, res) => {
    res.send({title: 'GET specific subscription!'});
});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {
    res.send({title: 'UPDATE a subscription!'});
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE a subscription!'});
});

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.get('/:id/cancel', (req, res) => {
    res.send({title: 'CANCEL a subscription!'});
});

export default subscriptionRouter;
import express from 'express';
import authRoute from './auth/auth.router';
import userRoute from './users/user.router';
import productsRoute from './products/product.router';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/products', productsRoute);

export default router;
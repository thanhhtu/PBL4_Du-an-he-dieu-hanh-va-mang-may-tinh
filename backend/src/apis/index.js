import express from 'express';
import authRoute from './auth/auth.router';
import userRoute from './users/user.router';
import productRoute from './products/product.router';
import reviewRoute from './reviews/review.router';
import cartRoute from './carts/cart.router';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/product', productRoute);
router.use('/review', reviewRoute);
router.use('/cart', cartRoute);

export default router;
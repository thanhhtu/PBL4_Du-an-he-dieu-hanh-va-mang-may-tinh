import express from 'express';
import reviewController from './review.controller';
import verifyMiddleware from '../../middleware/verify.middleware';
import authorizationMiddleware from '../../middleware/authorization.middleware';
import { Permission } from '../../types/rbac.object';
import validateMiddleware from '../../middleware/validate.middleware';

const route = express.Router();

route.get('/:productId',
    validateMiddleware.productId,
    reviewController.getProductReviews
);

route.use(verifyMiddleware.checkAuth);

route.get('/:productId/user',
    validateMiddleware.productId,
    reviewController.getUserProductReviews
);

route.post('/:productId',
    validateMiddleware.productId,
    authorizationMiddleware.checkPermission(Permission.ADD_REVIEW),
    validateMiddleware.checkReviewInfo,
    reviewController.addProductReview
);

route.route('/:reviewId')
    .put(
        validateMiddleware.reviewId,
        authorizationMiddleware.checkPermission(Permission.EDIT_REVIEW),
        validateMiddleware.checkReviewInfo,
        reviewController.updateProductReview
    )
    .delete(
        validateMiddleware.reviewId,
        authorizationMiddleware.checkPermission(Permission.DELETE_REVIEW),
        reviewController.deleteProductReview
    );

export default route;

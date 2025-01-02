import reviewService from './review.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class ReviewController {
    async getProductReviews(req, res, next) {
        try {
            const productId = req.params.productId;
            const result = await reviewService.getProductReviews(productId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async getUserProductReviews(req, res, next) {
        try {
            const userId = req.user.id;
            const productId = req.params.productId;
            const result = await reviewService.getUserProductReviews(userId, productId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async addProductReview(req, res, next) {
        try {
            const userId = req.user.id;
            const productId = req.params.productId;
            const {Rating, Content} = req.body;
            const result = await reviewService.addProductReview(userId, productId, Rating, Content);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Added successfully',
                insertId: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async updateProductReview(req, res, next) {
        try {
            const userId = req.user.id;
            const reviewId = req.params.reviewId;
            const {Rating, Content} = req.body;
            await reviewService.updateProductReview(userId, reviewId, Rating, Content);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Updated successfully',
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async deleteProductReview(req, res, next) {
        try {
            const userId = req.user.id;
            const reviewId = req.params.reviewId;
            await reviewService.deleteProductReview(userId, reviewId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Deleted successfully',
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new ReviewController();

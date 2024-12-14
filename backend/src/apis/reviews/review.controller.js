import reviewService from './review.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class ReviewController {
    async getAllProductReviews(req, res, next) {
        try {
            const productId = req.params.productId;
            const result = await reviewService.getAllProductReviews(productId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async getAllUserProductReviews(req, res, next) {
        try {
            const userId = req.user.id;
            const productId = req.params.productId;
            const result = await reviewService.getAllUserProductReviews(userId, productId);
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
                message: 'Add successfully',
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
            const result = await reviewService.updateProductReview(userId, reviewId, Rating, Content);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Update successfully',
                insertId: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async deleteProductReview(req, res, next) {
        try {
            const userId = req.user.id;
            const reviewId = req.params.reviewId;
            const result = await reviewService.deleteProductReview(userId, reviewId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Delete successfully',
                insertId: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new ReviewController();

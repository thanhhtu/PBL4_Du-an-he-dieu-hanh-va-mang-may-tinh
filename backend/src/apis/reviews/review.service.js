import { errorHandlerFunc } from '../../service/handleError.service';
import reviewModel from '../../models/review.model';
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';
import userModel from '../../models/user.model';
import productModel from '../../models/product.model';
import sanitizeService, { purifyString } from '../../service/sanitize.service';

class ReviewService{
    async reviewInfo(review){
        const username = (await userModel.getUserById(review.UserId)).FullName;
        let reviewInfo = {
            ReviewId: Number(review.ReviewId),
            User: username,
            ProductId: review.ProductId,
            Rating: Number(review.Rating),
            Content: review.Content,
            CreatedAt: review.CreatedAt,
            UpdatedAt: review.UpdatedAt
        };
        return reviewInfo;
    }

    async getAllProductReviews(productId){
        return errorHandlerFunc(async () => {
            const product = await productModel.getProductById(productId);
            if(!product){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found');
            }

            const reviews = await reviewModel.getReviewsByProductId(productId);
            let allReviewInfo = [];
            for(let review of reviews){
                let reviewInfo = await this.reviewInfo(review);
                allReviewInfo.push(reviewInfo);
            }
            return allReviewInfo;
        });
    }

    async getAllUserProductReviews(userId, productId){
        return errorHandlerFunc(async () => {
            const product = await productModel.getProductById(productId);
            if(!product){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found');
            }

            const reviews = await reviewModel.getUserProductReviews(userId, productId);
            let allReviewInfo = [];
            for(let review of reviews){
                let reviewInfo = await this.reviewInfo(review);
                allReviewInfo.push(reviewInfo);
            }
            return allReviewInfo;
        });
    }

    async addProductReview(userId, productId, Rating, Content){
        return errorHandlerFunc(async () => {
            const product = await productModel.getProductById(productId);
            if(!product){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found');
            }

            const purifyContent = await sanitizeService.purifyString(Content);
            const result = await reviewModel.addReview(userId, productId, Rating, purifyContent);

            /*
            //XSS
            const result = await reviewModel.addReview(userId, productId, Rating, Content);
            //XSS
            */
            
            return result;
        });
    }

    async updateProductReview(userId, reviewId, Rating, Content){
        return errorHandlerFunc(async () => {
            const userReview = await reviewModel.getUserReviewById(userId, reviewId);
            if(!userReview){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Permission denied. Unable to edit this review');
            }

            const purifyContent = await sanitizeService.purifyString(Content);
            const result = await reviewModel.updateReview(reviewId, Rating, purifyContent);

            /*
            //XSS
            const result = await reviewModel.updateReview(reviewId, Rating, Content);
            //XSS
            */
            
            return result;
        });
    }

    async deleteProductReview(userId, reviewId){
        return errorHandlerFunc(async () => {
            const userReview = await reviewModel.getUserReviewById(userId, reviewId);
            if(!userReview){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Permission denied. Unable to delete this review');
            }

            const result = await reviewModel.deleteReview(reviewId);
            
            return result;
        });
    }
}

export default new ReviewService();

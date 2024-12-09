import pool from '../config/db.config';
import { errorHandlerFunc } from '../service/handleError.service';

class ReviewModel {
    async getReviewsByProductId(productId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM review WHERE ProductId = ?;', productId);
            connection.release();
            return rows;
        });
    }

    async getUserReviewById(userId, reviewId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = 'SELECT * FROM review WHERE UserId = ? AND ReviewId = ?;';
            const value = [userId, reviewId];
            const [rows] = await connection.query(query, value);
            connection.release();
            return rows[0];
        });
    }

    async getUserProductReviews(userId, productId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM review WHERE UserId = ? AND ProductId = ?;', [userId, productId]);
            connection.release();
            return rows;
        });
    }

    async addReview(userId, productId, Rating, Content){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            
            const query = 'INSERT INTO review (UserId, ProductId, Rating, Content) VALUES (?, ?, ?, ?);';
            const value = [userId, productId, Rating, Content];
            const result = await connection.query(query, value);

            connection.release();
            return result[0].insertId;
        });
    }

    async updateReview(reviewId, Rating, Content){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            
            const query = 'UPDATE review SET Rating = ?, Content = ? WHERE ReviewId = ?;';
            const value = [Rating, Content, reviewId];
            const result = await connection.query(query, value);

            connection.release();
            return result[0].affectedRows;
        });
    }

    async deleteReview(reviewId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            
            const query = 'DELETE FROM review WHERE ReviewId = ?;';
            const value = [reviewId];
            const result = await connection.query(query, value);

            connection.release();
            return result[0].affectedRows;
        });
    }
}

export default new ReviewModel();

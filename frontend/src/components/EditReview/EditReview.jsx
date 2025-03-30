import React, { useState } from 'react';
import './EditReview.css';
import authService from '../../services/auth.service';
import { errorToast, successToast } from '../Notification/Notification';

const EditReview = ({review, onClose, handleAllReviews, onReviewAdded}) => {
    //review detail
    const [reviewDetail, setReviewDetail] = useState({
        Rating: review.Rating,
        Content: review.Content
    });

    const handleInputChange = (e) => {
        setReviewDetail({
            ...reviewDetail,
            [e.target.name]: e.target.value,
        });
    };

    const handleRating = (Rating) => {
        setReviewDetail((prevReview) => ({
            ...prevReview, 
            Rating, 
        }));
    };

    //edit review
    const handleEditReview = async (reviewId) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/review/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reviewDetail),
            })
    
            const data = await response.json();

            if (data.success) {
                successToast(data.message);
                onReviewAdded();
            } else {
                errorToast(data.message);
            }
            onClose();
            handleAllReviews();
        } catch (error) {
            errorToast(error.message);
            onClose();
        };
    }

    return (
        <div className='edit-review'>
            <div className='edit-review-content'>
                <div className='edit-review-header'>
                    <h2>EDIT REVIEW</h2>
                    <button onClick={onClose} className='close-btn'>&times;</button>
                </div>

                <div className='edit-review-body'>
                    <div className='edit-rating'>
                        <label htmlFor='rating'>Rating</label>
                        <div className='star-rating'>
                            {[...Array(5)].map((_, index) => (
                                <span 
                                    key={index} 
                                    className={index < reviewDetail.Rating ? 'star filled' : 'star'} 
                                    onClick={() => handleRating(index + 1)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='edit-content'>
                        <label htmlFor='content'>Your Review</label>
                        <textarea
                            id='content'
                            name='Content'
                            value={reviewDetail.Content}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>                        
                </div>

                <div className='edit-review-footer'>
                    <button onClick={() => handleEditReview(review.ReviewId)} className='update-btn'>UPDATE</button>
                    <button onClick={onClose} className='cancel-btn'>CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export default EditReview;
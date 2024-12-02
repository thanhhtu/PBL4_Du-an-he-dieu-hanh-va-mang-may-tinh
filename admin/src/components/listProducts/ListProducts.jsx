import React, { useEffect, useState } from 'react';
import './ListProducts.css';
import authService from '../../services/auth.service';
import { ReusableToastContainer, errorToast, successToast } from '../notification/Notification';
import EditProductPopup from '../editProduct/EditProduct';

const ListProducts = () => {
    const [allProducts, setAllProducts] = useState([]);

    //List products
    const fetchInfo = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch('http://localhost:4000/products', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                setAllProducts(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    //Edit product popup
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [currentEditProduct, setCurrentEditProduct] = useState(null);

    const openEditPopup = (product) => {
        setCurrentEditProduct({...product});
        setIsEditPopupOpen(true);
    };

    //Delete product
    const removeProduct = async (productId) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                successToast(data.message);
                fetchInfo();
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        };
    }

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5; //5 products per page

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='list-product'>
            <h1>PRODUCT LIST</h1>
            <div className='listProduct-format-main'>
                <p>No.</p>
                <p>Product</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Edit</p>
                <p>Remove</p>
            </div>
            <div className='listProduct-allProducts'>
                <hr />
                {currentProducts.map((product, index) => {
                    const no = index + (currentPage - 1) * productsPerPage + 1;
                    return (
                        <div key={index} className='listProduct-format-main listProduct-format'>
                            <p>{no}</p>
                            <img 
                                src={product.ImageUrl} 
                                alt='product image' 
                                className='listProduct-product-icon'
                            />
                            <p>{product.ProductName}</p>
                            <p>{product.Price} VND</p>
                            <p>{product.Quantity}</p>
                            <p onClick={() => openEditPopup(product)} className='listProduct-icon'>
                                <i className='fa-regular fa-pen-to-square' />
                            </p>
                            <p onClick={() => removeProduct(product.ProductId)} className='listProduct-icon'>
                                <i className='fa-solid fa-trash'></i>
                            </p>
                        </div>
                )})}
            </div>

            {/* Edit product popup */}
            {
                isEditPopupOpen && currentEditProduct && (
                    <EditProductPopup 
                        product={currentEditProduct}
                        onClose={() => setIsEditPopupOpen(false)}
                        fetchInfo={fetchInfo}
                    />
                )
            }

            {/* Pagination Controls */}
            <div className="pagination">
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
                
                <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            <ReusableToastContainer />
        </div>
    )
}

export default ListProducts;

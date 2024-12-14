import React, { useContext, useState } from 'react';
import './ShopCategory.css';
import { ShopContext } from '../../Context/ShopContext';
import Item from '../../components/Item/Item';
import Pagination from '../../components/Pagination/Pagination'

const ShopCategory = (props) => {
    const { allProducts } = useContext(ShopContext);
    
    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12; 

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='shop-category'>
            <img className='shopCategory-banner' src={props.banner} alt="Banner" />
            <div className='shopCategory-indexSort'>
                <p>
                    <span>Showing {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, allProducts.length)}</span> out of {allProducts.length} products
                </p>
            </div>
            <div className="shopCategory-product">
                {currentProducts.map((item) => (
                    <Item
                        key={item.ProductId} 
                        id={item.ProductId} 
                        name={item.ProductName} 
                        image={item.ImageUrl} 
                        price={item.Price}
                        quantity={item.Quantity}
                    />
                ))}
            </div>

            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
            />
        </div>
    );
};

export default ShopCategory;
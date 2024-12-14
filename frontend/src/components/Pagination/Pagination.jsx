import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, paginate }) => {
    const generatePageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pageNumbers = []; 

        pageNumbers.push(1); //always show first page

        if (currentPage <= 3) {
            pageNumbers.push(2, 3, 4, 5);
            pageNumbers.push('. . .');
        } else if (currentPage > totalPages - 3) {
            pageNumbers.push('. . .');
            pageNumbers.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
        } else {
            pageNumbers.push('. . .');
            pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
            pageNumbers.push('. . .');
        }

        if (!pageNumbers.includes(totalPages)) { //always show last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className='pagination'>
            <div className='pagination-row'>
                <button
                    className='pagination-button'
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {totalPages !== 0 && (<i className='fa-solid fa-less-than' />)}
                </button>

                {pageNumbers.map((number, index) => {
                    if (number === '. . .') {
                        return (
                            <span key={`ellipsis-${index}`} className='pagination-ellipsis'>
                                . . .
                            </span>
                        );
                    }
                    return (
                        <button
                            key={number}
                            onClick={() => typeof number === 'number' && paginate(number)}
                            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                            disabled={number === '. . .'}
                        >
                            {number}
                        </button>
                    );
                })}

                <button
                    className='pagination-button'
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    {totalPages !== 0 && (<i className='fa-solid fa-greater-than' />)}
                </button>
            </div>
        </div>
    );
};

export default Pagination;
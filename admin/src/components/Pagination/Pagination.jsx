import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, paginate }) => {
    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    //Split the page numbers into rows of 5
    const paginationRows = [];
    for (let i = 0; i < pageNumbers.length; i += 15) {
        paginationRows.push(pageNumbers.slice(i, i + 15));
    }

    return (
        <div className='pagination'>
            {paginationRows.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className='pagination-row'>
                        {rowIndex === 0 && (
                            <button
                                className='pagination-button'
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        )}

                        {row.map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                            >
                                {number}
                            </button>
                        ))}

                        {rowIndex === paginationRows.length - 1 && (
                            <button
                                className='pagination-button'
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Pagination;
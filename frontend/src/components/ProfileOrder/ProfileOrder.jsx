import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './ProfileOrder.css';
import authService from '../../services/auth.service';
import { errorToast } from '../Notification/Notification';
import { format } from 'date-fns';
import { formattedPrice } from '../../services/formatNum.service';
import { Link } from 'react-router-dom';

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className='pagination-actions'>
            <button
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                className='pagination-button'
                aria-label='first page'
            >
                <ChevronsLeft className='icon' />
            </button>
            <button
                onClick={handleBackButtonClick}
                disabled={page === 0}
                className='pagination-button'
                aria-label='previous page'
            >
                <ChevronLeft className='icon' />
            </button>
            <button
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                className='pagination-button'
                aria-label='next page'
            >
                <ChevronRight className='icon' />
            </button>
            <button
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                className='pagination-button'
                aria-label='last page'
            >
                <ChevronsRight className='icon' />
            </button>
        </div>
    );
};

const createData = (name, calories, fat) => {
    return { name, calories, fat };
};

const ProfileOrder = () => {
    //get all user orders
    const [allOrderData, setAllOrderData] = useState([]);
    const fetchDetailOrder = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/order`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            const data = await response.json();
            
            if (data.success) {
                setAllOrderData(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    useEffect(() => {
        fetchDetailOrder();
    }, []);

    // useEffect(() => {}, [allOrderData]);

    const [page, setPage] = useState(0);
    const [ordersPerPage, setOrdersPerPage] = useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * ordersPerPage - allOrderData.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setOrdersPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className='table-container'>
            <div className='table-overflow'>
                <table className='table' aria-label='custom pagination table'>
                    <thead className='table-header'>
                        <tr>
                            <th className='header-center col15'>No.</th>
                            <th className='header-center col30'>Order Time</th>
                            <th className='header-center col20'>Total Price</th>
                            <th className='header-center col20'>Payment Method</th>
                            <th className='header-center col15'>Receipt</th>
                        </tr>
                    </thead>

                    <tbody className='table-body'>
                        {(ordersPerPage > 0
                            ? allOrderData.slice(page * ordersPerPage, page * ordersPerPage + ordersPerPage)
                            : allOrderData
                        ).map((order, index) => (
                            <tr key={index} className='table-row'>
                                <td className='table-cell col15'>{page * ordersPerPage + index + 1}</td>
                                <td className='table-cell table-cell-center col30'>
                                    {format(new Date(order.CreatedAt), 'yyyy-MM-dd HH:mm:ss')}
                                </td>
                                <td className='table-cell table-cell-center col20'>
                                    {formattedPrice(order.TotalPrice)}
                                </td>
                                <td className='table-cell table-cell-center col20'>
                                    {order.PaymentMethod}
                                </td>
                                <td className='table-cell table-cell-center col15 profile-order-receipt'>
                                    <Link to={`/receipt/${order.OrderId}`} style={{textDecoration: 'none'}}>
                                        <i className='fa-solid fa-receipt' />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {emptyRows > 0 && (
                            <tr className='table-row empty-row' style={{ height: `${53 * emptyRows}px` }}>
                                <td colSpan={5} />
                            </tr>
                        )}
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colSpan={5}>
                                <div className='pagination-container'>
                                    <div className='rows-per-page'>
                                        <span className='pagination-text'>Rows per page:</span>
                                        <select
                                            className='rows-select'
                                            value={ordersPerPage}
                                            onChange={handleChangeRowsPerPage}
                                            aria-label='rows per page'
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={-1}>All</option>
                                        </select>
                                    </div>
                                    <div className='pagination-controls'>
                                        <span className='pagination-text'>
                                            {page * ordersPerPage + 1}-
                                            {Math.min((page + 1) * ordersPerPage, allOrderData.length)} of {allOrderData.length}
                                        </span>
                                        <TablePaginationActions
                                            count={allOrderData.length}
                                            page={page}
                                            rowsPerPage={ordersPerPage}
                                            onPageChange={handleChangePage}
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ProfileOrder;
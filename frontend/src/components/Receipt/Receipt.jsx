import React, { useEffect, useState } from 'react';
import './Receipt.css'
import {
    Document,
    Page,
    PDFViewer,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../../services/auth.service';
import { errorToast } from '../Notification/Notification';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        color: '#262626',
        fontFamily: 'Helvetica',
        fontSize: 12,
        padding: '30px 50px',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },

    title: {
        fontSize: 24,
    },

    textBold: {
        fontFamily: 'Helvetica-Bold',
    },

    spaceY: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },

    billTo: {
        marginBottom: 8,
    },

    table: {
        width: '100%',
        borderColor: '1px solid #f3f4f6',
        margin: '20px 0',
    },

    tableHeader: {
        backgroundColor: '#e5e5e5',
        flexDirection: 'row',
    },

    td: {
        padding: 6,
    },

    col15: {
        flexBasis: '15%',
    },

    col20: {
        flexBasis: '20%',
    },

    col30: {
        flexBasis: '30%',
    },

    totals: {
        alignItems: 'flex-end',
    },

    totalContent: {
        minWidth: 250,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },

    checkoutItem: {
        marginBottom: 8,
    },
});

const Receipt = () => {
    const { orderId } = useParams();
    const navigator = useNavigate();

    const [orderData, setOrderData] = useState({
        ShippingInfo: {},
        allOrderProducts: [],
        TotalPrice: 0,
        CreatedAt: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isSubscribed = true; 
    
        const fetchDetailOrder = async (orderId) => {
            try {
                setIsLoading(true);
                const token = authService.getExpiredItem('auth-token');
                const response = await fetch(
                    `http://localhost:4000/order/${orderId}`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                const data = await response.json();
    
                if (isSubscribed) {
                    if (data.success) {
                        setOrderData(data.data);
                    } else {
                        errorToast(data.message);
                        navigator('/profile/order');
                    }
                }
            } catch (error) {
                if (isSubscribed) {
                    errorToast(error.message);
                }
            } finally {
                if (isSubscribed) {
                    setIsLoading(false);
                }
            }
        };
    
        if (orderId) {
            fetchDetailOrder(orderId);
        }
    
        return () => {
            isSubscribed = false;
        };
    }, [orderId, navigator]);

    const ReceiptPDF = () => {
        if (!orderData.ShippingInfo) return null;

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.title, styles.textBold]}>
                                RECEIPT
                            </Text>
                            <Text>Receipt {orderData.CreatedAt}</Text>
                        </View>

                        <View style={styles.spaceY}>
                            <Text style={styles.textBold}>TTShop</Text>
                            <Text>University of Science and Technology</Text>
                            <Text>Danang University</Text>
                        </View>
                    </View>

                    <View style={styles.spaceY}>
                        <Text style={[styles.billTo, styles.textBold]}>
                            Bill to:
                        </Text>
                        <Text>{orderData.ShippingInfo.Name}</Text>
                        <Text>{orderData.ShippingInfo.PhoneNumber}</Text>
                        <Text>{orderData.ShippingInfo.Address}</Text>
                    </View>

                    <Table style={styles.table}>
                        <TH style={[styles.tableHeader, styles.textBold]}>
                            <TD style={[styles.td, styles.col15]}>No.</TD>
                            <TD style={[styles.td, styles.col30]}>Product</TD>
                            <TD style={[styles.td, styles.col15]}>Quantity</TD>
                            <TD style={[styles.td, styles.col20]}>Price</TD>
                            <TD style={[styles.td, styles.col20]}>Total</TD>
                        </TH>
                        {orderData.allOrderProducts.map((item, index) => (
                            <TR key={index}>
                                <TD style={[styles.td, styles.col15]}>
                                    {index + 1}
                                </TD>
                                <TD style={[styles.td, styles.col30]}>
                                    {item.ProductName}
                                </TD>
                                <TD style={[styles.td, styles.col15]}>
                                    {item.Quantity}
                                </TD>
                                <TD style={[styles.td, styles.col20]}>
                                    {item.PriceAtOrder}
                                </TD>
                                <TD style={[styles.td, styles.col20]}>
                                    {item.Quantity * item.PriceAtOrder}
                                </TD>
                            </TR>
                        ))}
                    </Table>

                    <View style={styles.totals}>
                        <View style={styles.totalContent}>
                            <View style={styles.checkoutTitle}>
                                <Text style={styles.checkoutItem}>Subtotal</Text>
                                <Text style={styles.checkoutItem}>Shipping Fee</Text>
                                <Text style={[styles.checkoutItem, styles.textBold]}>
                                    Total
                                </Text>
                            </View>

                            <View style={styles.checkoutPrice}>
                                <Text style={styles.checkoutItem}>
                                    {orderData.TotalPrice}
                                </Text>
                                <Text style={styles.checkoutItem}>Free</Text>
                                <Text style={[styles.checkoutItem, styles.textBold]}>
                                    {orderData.TotalPrice}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <div>
            <div className="pdf-container">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <PDFViewer className="pdf-viewer">
                        <ReceiptPDF />
                    </PDFViewer>
                )}
            </div>
        </div>
    );
}

export default Receipt;
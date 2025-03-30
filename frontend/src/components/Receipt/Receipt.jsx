import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../../services/auth.service';
import { errorToast } from '../Notification/Notification';
import './Receipt.css';

const Receipt = () => {
    const [searchParams] = useSearchParams();
    const filename = searchParams.get('filename');
    const token = authService.getExpiredItem('auth-token');

    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await fetch(`http://localhost:4000/order/receipt?filename=${filename}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    setPdfUrl(url);
                } else {
                    const data = await response.json();
                    errorToast(data.message);
                    navigate('/profile/order');
                }
            } catch (error) {
                errorToast(error.message);
                navigate('/profile/order');
            } finally {
                setLoading(false);
            }
        };

        fetchPdf();
        
        return () => {
            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [filename, token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='pdf-container'>
            <iframe 
                className='pdf-content'
                src={pdfUrl}
                style={{ border: 'none' }}
                title='PDF Viewer'
            />
        </div>
    );
};

export default Receipt;
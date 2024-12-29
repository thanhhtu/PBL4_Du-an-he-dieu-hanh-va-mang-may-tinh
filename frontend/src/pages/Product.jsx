import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrum from '../components/Breadcrums/Breadcrum';
import { ShopContext } from '../Context/ShopContext';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import DescriptionReviewBox from '../components/DescriptionReviewBox/DescriptionReviewBox';
import RelatedProducts from '../components/RelatedProducts/RelatedProducts';

const Product = () => {
    const {allProducts}= useContext(ShopContext);
    const {productId}= useParams();
    const product = allProducts.find((e)=> e.ProductId === Number(productId));
    if (!product) {
        return <div>Product not found</div>; // Fallback if product not found
    }
    const [reviewsUpdated, setReviewsUpdated] = useState(0);
    return (
        <div>
            <Breadcrum product= {product} />
            <ProductDisplay 
                product={product} 
                reviewsUpdated={reviewsUpdated}
            />
            <DescriptionReviewBox 
                product={product} 
                onReviewAdded={() => setReviewsUpdated(prev => prev + 1)}
            />
            <RelatedProducts/>
        </div>
    );
};

export default Product;
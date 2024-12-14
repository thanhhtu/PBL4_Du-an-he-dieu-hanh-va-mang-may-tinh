import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrum from '../components/Breadcrums/Breadcrum';
import { ShopContext } from '../Context/ShopContext';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import DescriptionReviewBox from '../components/DescriptionReviewBox/DescriptionReviewBox';
import RelatedProducts from '../components/RelatedProducts/RelatedProducts';

const Product = () => {
    const {allProducts}= useContext(ShopContext)
    const {productId}= useParams();
    const product = allProducts.find((e)=> e.ProductId === Number(productId));
    if (!product) {
        return <div>Product not found</div>; // Fallback if product not found
    }
    return (
        <div>
           <Breadcrum product= {product} />
           <ProductDisplay product={product} />
           <DescriptionReviewBox product={product} />
           <RelatedProducts/>
        </div>
    );
};

export default Product;
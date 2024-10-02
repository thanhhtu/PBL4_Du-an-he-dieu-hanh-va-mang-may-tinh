import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrum from '../components/Breadcrums/Breadcrum';
import { ShopContext } from '../Context/ShopContext';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../components/RelatedProducts/RelatedProducts';

const Product = () => {
    const {all_product}= useContext(ShopContext)
    const {productId}= useParams();
    const product = all_product.find((e)=> e.id === Number(productId));
    if (!product) {
        return <div>Product not found</div>; // Fallback if product not found
    }
    return (
        <div>
           <Breadcrum product= {product} />
           <ProductDisplay product={product} />
           <DescriptionBox/>
           <RelatedProducts/>
        </div>
    );
};

export default Product;
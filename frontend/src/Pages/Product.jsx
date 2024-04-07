import React, { useContext } from 'react'
import { ShopContext } from '../Contexts/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionsBox from '../Components/DesctiptionBox/DescriptionsBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {

  const {all_products} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_products.find((e) => e.id === Number(productId));


  return (
    <div>
        <Breadcrum product={product} />
        <ProductDisplay product={product} />
        <DescriptionsBox />
        <RelatedProducts/>
    </div>
  )
}

export default Product
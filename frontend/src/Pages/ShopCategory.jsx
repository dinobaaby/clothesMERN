import React, { useContext } from 'react'
import "./css/ShopCaregory.css"
import { ShopContext } from '../Contexts/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';



function ShopCategory(props) {
  const {all_products} = useContext(ShopContext);
  
  return (
    <div className='shop-category'>
        <img className='shopcategory-banner' src={props.banner} alt="" />
        <div className="shopcategory-indexSort">
          <p>
            <span>
              Showing 1-12
            </span>
            out of 36 products
          </p>

          <div className='shopcategory-sort'>
              Sort <img src={dropdown_icon} alt="" />
          </div>

        </div>
        <div className="shopcategory-product">
          {all_products.map((item, index) => {
              if(props.category === item.category){
                return <Item key={index} id={item.id} name={item.name} image = {item.image} new_price={item.new_price} old_price={item.old_price}  />
              }else{
                return null;
              }
          })}
        </div>
        <div className="shopcategory-loadmore">
          Explore more
        </div>
    </div>
  )
}

export default ShopCategory;

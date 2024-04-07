import React, { useEffect, useState } from 'react'
import "./Popular.css"

import Item from '../Item/Item'

export default function Popular() {
  const [popularproduct,setPopularProduct] = useState([])
  useEffect(() =>{
    fetch('http://localhost:4000/popularinwomen')
      .then((res) => res.json())
      .then((data) => setPopularProduct(data.products))
  }, [])
  return (
    <div className='popular'>
        <h1>PUPULAR IN WOMEN</h1>
        <hr />
        <div className="popular-item">
            {popularproduct.map((item, index) =>{
                return <Item key={index} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            })}
        </div>
    </div>
  )
}

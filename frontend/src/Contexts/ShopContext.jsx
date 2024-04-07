import React, {createContext, useEffect, useState} from "react";



export const ShopContext = createContext(null)

const getDefaultCart = () =>{
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
        
    }
    return cart;
}

const ShopContextProvider = (props) =>{



    const [all_products, setAll_Products] = useState([]) 

    const [cartItems, setCartItems] = useState(getDefaultCart());
    
    useEffect(() =>{
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((response) => setAll_Products(response.products));

            const token = localStorage.getItem('auth-token');
            if (token) {
                fetch('http://localhost:4000/getcart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify({})
                })
                .then((response) => response.json())
                .then((data) => setCartItems(data))
                .catch((error) => {
                    console.error('Error fetching cart:', error);
                    // Handle error (e.g., show error message to user)
                });
            }
    },[])
    
    const addToCart = (itemId) =>{
        setCartItems((prev) =>({...prev, [itemId] :prev[itemId] +1}));
        if(localStorage.getItem('auth-token')){
            
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers:{
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((res) => res.json())
            .then((data) => console.log(data))
        }else{
            window.location.replace('/login')
        }

        
        
    }
    console.log(cartItems);

    const removeFromCart = (itemId) =>{
        setCartItems((prev) =>({...prev, [itemId] :prev[itemId] -1}));
        if(localStorage.getItem('auth-token')){
            
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers:{
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((res) => res.json())
            .then((data) => console.log(data))
        }else{
            window.location.replace('/login')
        }
    }


    const getTotalCartAmount = () =>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = all_products.find((product) => product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }

        return totalAmount;
    } 
    const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {all_products, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems}
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
const port = 4000;
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const  Product  = require('./models/product.model');
const Users = require('./models/user.model');
const app = express();



app.use(express.json());
app.use(cors());

// database connection with mongoDB
mongoose.connect("mongodb+srv://trinhhieu26:Ab6asdfg!@cluster0.pjllqyb.mongodb.net/e-commerce")

// API Creation
app.get("/", (req, res) =>{
    res.send("Express App is running")
})

// Image storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Create Upload Endpoint for images
app.use('/images', express.static('upload/images')) // static file

app.post("/upload", upload.single("product"),(req, res) =>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})



app.post('/addproduct', async(req, res) =>{
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }else{
        id = 1;
    }
    const product = new Product({
        id:id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name
    })
})


// Creating API For deleting Product
app.post('/removeproduct', async(req,res) =>{
    const product = await Product.findOneAndDelete({id:req.body.id});
    // const image_url = product.image.split('/');
    // const filename = image_url[image_url.length - 1];
    

    // fs.unlink(urlFile, (err)=> {
    //     if (err) {
    //       console.error('Error while deleting file:', err);
    //       return;
    //     }
      
    //     console.log('File deleted successfully');
    //   })
    console.log("Removed Product");
    res.json({
        success: true,
        name: req.body.name,
        id: req.body.id
    })
})

app.get('/allproducts', async(req,res) =>{
    let products = await Product.find({});
    res.json({
        success: true,
        products: products
    })
})



app.post('/signup', async (req, res) =>{
    let check = await Users.findOne({email: req.body.email});
    if(check){
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }

    let cart= {};
    for(let i=0; i<300; i++){
        cart[i] = 0;
    }

    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })

    await user.save();
    const data = {
        user:{
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom')

    console.log("Saved");
    res.json({
        success: true,
        metaData: user,
        token: token
    })
})


app.post('/login', async (req, res) =>{
    let user = await Users.findOne({email: req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            return res.status(200).json({
                success: true,
                token
            })
        }
        return res.status(404).json({
            success: false,
            message: "Wrong password"
        })
    }

    return res.status(404).json({
        success: false,
        message: "User not found"
    })

})


app.get('/newcollections', async (req, res) =>{
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8)
    res.json({
        success: true,
        products: newcollections
    })
})


app.get('/popularinwomen', async (req, res) =>{
    let products = await Product.find({category: 'women'});
    let popularinwomen = products.slice(0,4);
    res.json({
        success: true,
        products: popularinwomen
    })
})


const fetchUser = async (req, res, next) =>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({
            success: false,
            message: "No token provided"
        })
    }else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(e){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
    }
}

app.post('/addtocart', fetchUser ,async (req, res) =>{
    console.log(req.body, req.user);
    let userData = await Users.findOne({_id: req.user.id});
    userData.cartData[parseInt(req.body.itemId)] += 1;
    await Users.findOneAndUpdate({_id: req.user.id},{cartData:userData.cartData})
    res.send('Added')
})


app.post('/removefromcart',fetchUser, async (req, res)=>{
    console.log('Remove', req.body.itemId);
    
    let userData = await Users.findOne({_id: req.user.id});
    if(userData.cartData[parseInt(req.body.itemId)] > 0){
        userData.cartData[parseInt(req.body.itemId)] -= 1;
    await Users.findOneAndUpdate({_id: req.user.id},{cartData:userData.cartData})
    }
    
    res.send('removed')
})

app.post('/getcart', fetchUser, async (req, res)=>{
    let userData = await Users.findOne({_id: req.user.id});
    console.log(userData.cartData);
    res.json(userData.cartData)
})
app.listen(port, (error)=>{
    if(!error) {
        console.log("Server running on port " + port);
    }
    else {
        console.log("Error :" + error);
    }
})



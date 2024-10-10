import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import 'dotenv/config';

import errorHandler from './middleware/handleError.middleware.js';
import { log } from 'console';
// import routers from './apis';


const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

//Database with mongodb (password: vttus)
mongoose.connect('mongodb+srv://vttus:vttus@cluster0.24jrv.mongodb.net/ECommerce?retryWrites=true&w=majority&appName=E-Commerce')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// app.use('/', routers);

//file upload.config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './public/images/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
})

const upload = multer({storage: storage})
//file upload.config

//api upload
app.use('/images', express.static(path.join(__dirname, './public/images/')))
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${process.env.PORT}/images/${req.file.filename}`
    })
})
//api upload

//schema for creating product
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    }
})
//schema for creating product

app.post('/addproduct', async (req, res) => {
    try{
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
            id: id,
            name: req.body.name,
            image: req.body.image,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        console.log(product);
        await product.save();
        console.log("saved");
        res.json({
            success: true,
            name: req.body.name,
        });
    }catch(err){
        res.json({
            success: false,
            name: err.message,
        });
    }
})

//api for removing product
app.delete('/removeproduct', async(req, res) => {
    try{
        await Product.findOneAndDelete({id: req.body.id});
        console.log("Removed");
        res.json({
            success: true,
            name: req.body.name
        });
    }catch(err){
        res.json({
            success: false,
            name: err.message,
        });
    }
})

app.get('/allproducts', async(req, res) => {
    try{
        let products = await Product.find({});
        console.log("All products fetched");

        res.json({
            success: true,
            products: products
        });
    }catch(err){
        res.json({
            success: false,
            name: err.message,
        });
    }
})

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, (err) => {
    if(!err){
        console.log(`Example app listening on port ${port}`);
    }else{
        console.log('Error: ' + err.message);
    }
})

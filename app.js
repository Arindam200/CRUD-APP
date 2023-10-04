const express = require("express");
const mongoose = require("mongoose"); 
const bodyParser =  require("body-parser");
const PORT =  4500;
const app = express();

mongoose.connect("mongodb://localhost:27017/sample",{useNewurlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log('Connected with MongoDB')
}).catch((err)=>{
    console.log(err)
})
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

const productSchema = mongoose.Schema({
    name:String,
    description:String,
    price:Number,
})

const Product = new mongoose.model("Product", productSchema);


// Create Product
app.post("/api/v1/product/new", async(req, res)=>{
    const newProduct = await Product.create(req.body)
    res.status(201).json({
        success:true,
        newProduct
    });
})


// Read Product 
app.get("/api/v1/products", async (req,res)=>{
    const products = await Product.find();

    res.status(200).json({
        success:true,
        products
    }) 
})

// Read by ID

app.get("/api/v1/product/:id", async (req, res)=>{
    const product = await Product.findById(req.params.id);

    res.status(200).json({
        success:true,
        product
    })
})

// update products
app.put("/api/v1/product/:id", async (req, res)=>{ 
    let product = await Product.findById(req.params.id);
    
    if(!product){
        return res.status(500).json({
            success:"false",
            message:"Product Not Found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify:false,
        runValidators:true
    })

    res.status(200).json({ 
        success:true,  
        product
    })
})


// Delete Product 

app.delete("/api/v1/product/:id", async (req, res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:"false",
            message:"Product Not Found"
        })
    }

    await Product.deleteOne({ _id: req.params.id});

    res.status(200).json({
        success:true, 
        message:"Product Deleted Successfully"
    })
})

app.listen(PORT, ()=>{
    console.log(`server is working at ${PORT}`);
})
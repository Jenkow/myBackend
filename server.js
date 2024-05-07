import express from 'express';
import productManager from './ProductManager.js';
import cartManager from './CartManager.js';

let server = express();

let PORT = 8080;
let ready = () => console.log('server ready on port: ' + PORT);

server.use(express.urlencoded({ extended: true }))
server.listen(PORT, ready);

let index_function = (req, res) => {
    let products = productManager.getProducts();
    return res.send(`There are ${products.length} products`);
}

server.get('/', index_function);

server.get('/api/products', (req,res) => {
    let products = productManager.getProducts();
    let limit = Number(req.query.limit ?? products.length);
    let selectedProducts = products.slice(0, limit);
    if(selectedProducts.length>0) {
        return res.send({
            success: true,
            response: selectedProducts
        })
    } else {
        return res.send({
            success: false,
            products: 'not found'
        })
    }
})

server.get('/api/products/:pid', (req, res) => {
    let pid = Number(req.params.pid);
    let product = productManager.getProductById(pid);
    if (product) {
        return res.send({
            success: true,
            response: product
        })
    } else {
        return res.send({
            success: false,
            response: {}
        })
    }
})

server.get('/api/carts', (req,res) => {
    let carts = cartManager.getCarts();
    if(carts.length>0){
        return res.send({
            success: true,
            response: carts
        })
    } else {
        return res.send({
            success: false,
            response: 'Not found'
        })
    }
})

server.get('/api/carts/:cid', (req,res) => {
    let cid = Number(req.params.cid);
    let cart = cartManager.getCartById(cid);
    console.log(cart)
    if (cart) {
        return res.send({
            success: true,
            response: cart
        })
    } else {
        return res.send({
            success: false,
            response: {}
        })
    }
})
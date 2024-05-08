import express from 'express';
import productManager from './ProductManager.js';
import cartManager from './CartManager.js';

let server = express();

let PORT = 8080;
let ready = () => console.log('server ready on port: ' + PORT);

server.listen(PORT, ready);
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

let index_function = (req, res) => {
    let products = productManager.getProducts();
    return res.send(`There are ${products.length} products`);
}

server.get('/', index_function);

server.get('/api/products', (req, res) => {
    let products = productManager.getProducts();
    let limit = Number(req.query.limit ?? products.length);
    let selectedProducts = products.slice(0, limit);
    if (selectedProducts.length > 0) {
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

server.post('/api/products', async (req, res) => {
    try {
        let name = req.body.name ?? null;
        let price = req.body.price ?? null;
        let stock = req.body.stock ?? null;
        if (name && price && stock) {
            let product = await productManager.addProduct({ name, price, stock });
            return res.json({
                status: 201,
                product_id: product.id,
                response: 'product added'
            })
        } else {
            return res.json({
                status: 400,
                response: 'check data'
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({
            status: 500,
            response: 'error'
        })
    }
})

server.put('/api/products/:pid', (req, res) => {
    try {
        if (req.body && req.params.pid) {
            let id = Number(req.params.pid);
            let data = req.body;
            productManager.updateProduct(id, data);
            return res.json({
                status: 200,
                response: 'product updated'
            })
        } else {
            return res.json({
                status: 400,
                response: 'check data'
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({
            status: 500,
            response: 'error'
        })
    }
})

server.delete('/api/products/:pid', (req, res) => {
    try {
        if (req.params.pid && !isNaN(req.params.pid)) {
            let id = Number(req.params.pid);
            let deleted = productManager.getProductById(id);
            if (!deleted) {
                return res.json({
                    status: 400,
                    response: 'product id not found'
                })
            }
            productManager.destroyProduct(id);
            return res.json({
                status: 200,
                response: 'product deleted'
            })
        } else {
            return res.json({
                status: 400,
                response: 'check data'
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({
            status: 500,
            response: 'error'
        })
    }
})

server.get('/api/carts', (req, res) => {
    let carts = cartManager.getCarts();
    if (carts.length > 0) {
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

server.get('/api/carts/:cid', (req, res) => {
    let cid = Number(req.params.cid);
    let cart = cartManager.getCartById(cid);
    if (cart) {
        return res.json({
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

server.post('/api/carts', async (req, res) => {
    try {
        let newCart = await cartManager.addCart();
        return res.json({
            status: 200,
            response: `cart with id: ${newCart.id} created`
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status: 500,
            response: 'error'
        })
    }
})

server.put('/api/carts/:cid/:pid', async (req, res) => {
    try {
        let cid = Number(req.params.cid) ?? null;
        let pid = Number(req.params.pid) ?? null;
        let quantity = Number(req.body.quantity) ?? null;
        if (cid && pid && quantity) {
            let cart = await cartManager.addProduct(cid, pid, quantity);
            if (cart) {
                return res.json({
                    status: 200,
                    response: `${quantity}x product (pid: ${pid}) added to cart (cid: ${cid})`
                })
            } else {
                return res.json({
                    status: 400,
                    response: 'cart not found'
                })
            }
        } else {
            return res.json({
                status: 400,
                response: 'check data'
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({
            status: 500,
            response: 'error'
        })
    }

})

server.delete('/api/carts/:cid/:pid', (req, res) => {
    let cid = Number(req.params.cid) ?? null;
    let pid = Number(req.params.pid) ?? null;
    if (cid && pid) {
        cartManager.deleteProduct(cid, pid);
        return res.json({
            status: 200,
            response: `product (pid: ${pid}) deleted from cart (cid: ${cid})`
        })
    } else {
        return res.json({
            status: 400,
            response: 'check data'
        })
    }
})

server.delete('/api/carts/:cid', (req, res) => {
    let cid = Number(req.params.cid) ?? null;
    if (cid) {
        cartManager.deleteCart(cid);
        return res.json({
            status: 200,
            response: `cart (cid: ${cid}) deleted`
        })
    } else {
        return res.json({
            status: 400,
            response: 'check data'
        })
    }
})
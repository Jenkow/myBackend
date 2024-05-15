import { Router } from 'express';
import productManager from '../ProductManager.js';

const router = Router();

router.get('/', (req, res) => {
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

router.get('/:pid', (req, res) => {
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

router.post('/', async (req, res) => {
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

router.put('/:pid', (req, res) => {
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

router.delete('/:pid', (req, res) => {
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

export default router;
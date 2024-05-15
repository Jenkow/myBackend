import { Router } from 'express';
import cartManager from '../CartManager.js';

const router = Router();

router.get('/', (req, res) => {
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

router.get('/:cid', (req, res) => {
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

router.post('/', async (req, res) => {
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

router.put('/:cid/product/:pid/:units', async (req, res) => {
    try {
        let cid = Number(req.params.cid) ?? null;
        let pid = Number(req.params.pid) ?? null;
        let quantity = Number(req.params.units) ?? null;
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

router.delete('/:cid/product/:pid/:units', (req, res) => {
    let cid = Number(req.params.cid) ?? null;
    let pid = Number(req.params.pid) ?? null;
    let quantity = Number(req.params.units) ?? null;
    if (cid && pid && quantity) {
        cartManager.deleteProduct(cid, pid, quantity);
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

router.delete(':cid', (req, res) => {
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

export default router;
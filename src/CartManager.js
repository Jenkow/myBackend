import fs from 'fs';
import productManager from './ProductManager.js'

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.init(path);
    }

    init(path) {
        let file = fs.existsSync(path)
        if (!file) {
            fs.writeFileSync(path, '[]');
            console.log('file created at path: ' + this.path)
            return ('file created at path: ' + this.path);
        } else {
            this.carts = JSON.parse(fs.readFileSync(path, 'UTF-8'))
            console.log('data recovered');
            return ('data recovered');
        }
    }

    async addCart() {
        try {
            let data = {};
            if (this.carts.length > 0) {
                let next_id = this.carts[this.carts.length - 1].id + 1;
                data.id = next_id;
            } else {
                data.id = 1
            }
            data.products = [];
            this.carts.push(data);
            let data_json = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, data_json);
            console.log('created cart id: ' + data.id);
            return (data);
        } catch (error) {
            console.log(error);
            return ("addCart: error")
        }
    }

    getCarts() {
        try {
            if (this.carts.length > 0) {
                return this.carts;
            } else {
                return "Not found";
            }
        } catch (error) {
            console.log(error);
            return "getCarts: error";
        }
    }

    getCartById(cid) {
        try {
            let one = this.carts.find(each => each.id === cid)
            if (one) {
                return one;
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return 'getCartById: error';
        }
    }

    async addProduct(cid, pid, quantity) {
        try {
            let cart = this.getCartById(cid);
            if (cart) {
                let product = cart.products.find(each => each.pid === pid)
                if (product) {
                    product.quantity += quantity;
                } else {
                    cart.products.push({ pid, quantity })
                }
                let data_json = JSON.stringify(this.carts, null, 2);
                await fs.promises.writeFile(this.path, data_json);
                return cart;
            } else {
                console.log('cart not found');
                return undefined
            }
        } catch (error) {
            console.log(error)
            return 'error: addProduct'
        }
    }

    async deleteProduct(cid, pid, quantity) {
        try {
            let cart = this.getCartById(cid);
            if (cart) {
                let product = cart.products.find(each => each.pid === pid);
                if (product && product.quantity > quantity) {
                    product.quantity -= quantity;
                } else {
                    cart.products = cart.products.filter(each => each.pid !== pid);
                }
                let data_json = JSON.stringify(this.carts, null, 2);
                await fs.promises.writeFile(this.path, data_json);
                return;
            } else {
                console.log('cart not found');
                return 'cart not found'
            }
        } catch (error) {
            console.log(error);
            return 'error: deleteProduct'
        }
    }

    async deleteCart(cid) {
        try {
            let cart = this.getCartById(cid)
            this.carts = this.carts.filter(each => each.id !== cid);
            let data_json = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, data_json);
            return cart
        } catch (error) {
            console.log(error)
            return 'error: deleteCart'
        }
    }
}

let manager = new CartManager('./data/carts.json')

export default manager;
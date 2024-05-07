import fs from 'fs';

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
}

let manager = new CartManager('./data/carts.json')

export default manager;
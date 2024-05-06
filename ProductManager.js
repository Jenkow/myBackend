import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        this.init(path);
    }

    init(path) {
        let file = fs.existsSync(path)
        if(!file) {
            fs.writeFileSync(path, '[]');
            console.log('file created at path: '+ this.path)
            return ('file created at path: '+ this.path);
        } else {
            this.products = JSON.parse(fs.readFileSync(path,'UTF-8'))
            console.log('data recovered');
            return ('data recovered');
        }
    }

    async addProduct({name, price}) {
        try {
            let data = {name, price};
            if (this.products.length>0) {
                let next_id = this.products[this.products.length-1].id+1;
                data.id = next_id;
            } else {
                data.id = 1
            }
            this.products.push(data);
            let data_json = JSON.stringify(this.products,null,2);
            await fs.promises.writeFile(this.path, data_json);
            console.log('created product id: '+ data.id);
            return ('product id: '+ data.id);
        } catch (error){
            console.log(error);
            return ("addProduct: error");
        }
    }

    getProducts() {
        try {
            if (this.products.length > 0) {
                return this.products;
            } else {
                return "Not found";
            }
        } catch (error) {
            console.log(error);
            return "getProducts: error";
        }
    }

    getProductById(pid) {
        try {
            let one = this.products.find(each => each.id === pid)
            if (one) {
                return one;
            } else {
                return 'Not found';
            }
        } catch (error) {
            console.log(error);
            return 'getProductById: error';
        }
    }

    async update_product(id, data) {
        try {
            let one = this.getProduct(id);
            for (let prop in data) {
                one[prop] = data [prop];
            }
            let data_json = JSON.stringify(this.products,null,2);
            await fs.promises.writeFile(this.path,data_json);
            console.log('updated product: '+ id);
            return ('updated product: '+ id);
        } catch(error) {
            console.log(error);
            return ('error: updating product');
        }
    }

    async destroy_product(id) {
        try {
            this.products = this.products.filter(each => each.id!==id);
            let data_json = JSON.stringify(this.products,null,2);
            await fs.promises.writeFile(this.path, data_json);
            console.log('deleted product id: '+ id);
            return ('deleted product id: '+ id);
        } catch(error){
            console.log(error);
            return ('error: deleting product');
        }
    }
}

let manager = new ProductManager('./data/products.json')
//
//async function manage() {
//    await manager.add_product({ name:'Zanella Ciclo 50', price: 500 })
//    await manager.add_product({ name:'Zanella Sol 90', price: 1000 })
//    await manager.add_product({ name:'Susuki AX', price: 2000 })
//    await manager.add_product({ name:'test 1', price: 1000 })
//    await manager.add_product({ name:'test 2', price: 1000 })
//    await manager.update_product(3, {name: 'Susuki AX 100', price: 1500})
//    await manager.destroy_product(4)
//    await manager.destroy_product(5)
//}

export default manager;
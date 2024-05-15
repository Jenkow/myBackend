import express from 'express';
import productsRouter from './routes/productRouter.js'
import cartsRouter from './routes/cartRouter.js'
import __dirname from './utils.js'


let server = express();

let PORT = 8080;
let ready = () => console.log('server ready on port: ' + PORT);

server.listen(PORT, ready);
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(__dirname + '/public'));

server.use('/api/products', productsRouter);
server.use('/api/carts', cartsRouter);
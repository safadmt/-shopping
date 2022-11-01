const Order= require('../models/order');
const Product = require('../models/product');

exports.orders_get_order = (req, res, next) => {
    Order.find()
    .select('_id product quantity')
    .populate('product', 'name')
    .exec()
    .then(result => {
        const response = {
            count: result.length,
            order: result.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    message: 'Order created',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        }

        console.log(response)
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
};

exports.orders_post_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
       
        });
        return order.save();
    })
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order stored',
                orderCreated: {
                    id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
                
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'product not found'
            })
        })
    
    
};

exports.orders_get_One_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(doc => {
        console.log(doc)
        res.status(200).json({
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/'
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
};

exports.orders_delete_one_order = (req, res, next) => {
    Order.deleteOne({_id:req.params.orderId}).exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: 'Deleted product',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: {productId: 'ID', quantity: 'Number'}
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: err
        })
    })

};

exports.orders_delete_all_orders = (req, res, next) => {
    Order.find()
    .exec()
    .then(doc => {
        console.log(doc)
        res.status(200).json({
            message: 'Deleted all orders',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/',
                body: {productId: 'ID', quantity: 'Number'}
            }
        })
    })
};
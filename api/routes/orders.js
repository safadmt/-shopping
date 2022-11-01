const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const orderController = require('../controllers/orders');



router.get('/', checkAuth, orderController.orders_get_order)
   
 
router.post('/', checkAuth, orderController.orders_post_order);

router.get('/:orderId', checkAuth, orderController.orders_get_One_order);

router.delete('/:orderId', checkAuth, orderController.orders_delete_one_order);

router.delete('/', orderController.orders_delete_all_orders);

module.exports = router;
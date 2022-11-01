const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const productControllers = require('../controllers/products')



const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },

    filename: function(req, file, callback) {
        callback(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname)
    }
});

const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

 const upload = multer({storage: storage})



router.get('/', productControllers.product_getAll);

router.post('/', checkAuth, upload.single('productImage'), productControllers.product_createProduct);

router.get('/:productId', productControllers.product_getById);

router.patch('/:productId', checkAuth, productControllers.product_updateOne);

router.delete('/', checkAuth, productControllers.product_delete);

router.delete('/:productId', checkAuth, productControllers.product_delelteOne);

module.exports = router;
const Product = require('../models/product');

exports.product_getAll = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
         const response = {
             count: docs.length,
             product: docs.map(doc => {
                 return {
                     name: doc.name,
                     price: doc.price,
                     productImage: doc.productImage,
                     _id: doc._id,
                     request: {
                         type: 'GET',
                         url: 'http://localhost:3000/products/'+ doc._id
                     }
                 }
             })
         }
         // if(docs >= 0) {
              console.log(docs);
              res.status(200).json({response})
         // } else {
         //     res.status(494)
         // }
           
    })
    .catch(err => {
         console.log(err)
         res.status(500).json({errors: err})
    })
 };
 exports.product_createProduct = (req, res, next) => {

    console.log(req.file)
    
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
                res.status(201).json({
                message: "Handling post request to /products",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+ result._id
                    }
                }
            })
            
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    
};

exports.product_getById = (req, res, next) => {
    const id = req.params.productId
   Product.findById(id)
   .select('name price _id productImage')
   .exec()
   .then(doc => {
        console.log('from database', doc);
        if(doc) {
            res.status(200).json({
                doc,
                description: 'Got the product',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + doc._id
                }
               });
        } else {
            res.status(404).json({message:'Not valid entry found for provided id'})
        }
        
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
}


exports.product_updateOne = (req, res, next) => {
    
    id= req.params.productId
    // const updateOps = {}
    // for(const ops of (req.body)) {
    //     updateOps[ops.propName] = ops.value
    // }
    //if we want to use {$set: req.body}, it will also update the prefered item
    Product.updateOne({_id: id},{$set: req.body}).exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err
        })
    })
};

exports. product_delete = (req, res, next) => {
    Product.deleteMany().exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: 'Deleted all product successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
};

exports.product_delelteOne = (req, res, next) => {
    id = req.params.productId
    Product.deleteOne({_id: id}).exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: 'Product deleted successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

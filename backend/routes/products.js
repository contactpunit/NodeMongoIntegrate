const Router = require('express').Router;
const mongodb = require('mongodb');
const Decimal128 = mongodb.Decimal128;
const objectId = mongodb.ObjectId;

const db = require('../db');

const router = Router();

// Get list of products products
router.get('/', (req, res, next) => {
  const products = []
  db.getDb()
    .db()
    .collection('products')
    .find()
    .forEach(product => {
      product.price = product.price.toString();
      products.push(product)
      // return products
    })
    .then(result => {
      console.log(result);
      res.status(200).json(products);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error has occured.' });
    })
});

// Get single product
router.get('/:id', (req, res, next) => {
  db.getDb()
    .db()
    .collection('products')
    .findOne({ _id: new objectId(req.params.id) })
    .then(prod => {
      prod.price = prod.price.toString()
      res.status(200).json(prod)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred' })
    })
});

// Add new product
// Requires logged in user
router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb()
    .db()
    .collection('products').insertOne(newProduct)
    .then(result => {
      console.log(result);
      res.status(201).json({ message: 'Product added', productId: result.insertedId });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error has occured.' });
    })
});

// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb()
    .db()
    .collection('products')
    .updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: updatedProduct })
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        productId: req.params.id
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error has occured.' });
    })
});


// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  res.status(200).json({ message: 'Product deleted' });
});

module.exports = router;

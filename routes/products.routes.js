const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

router.get('/products', (req, res) => {
  req.db
    .collection('products')
    .find()
    .toArray()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get('/products/random', (req, res) => {
  req.db
    .collection('products')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get('/products/:id', (req, res) => {
  req.db
    .collection('products')
    .findOne({ _id: ObjectId(req.params.id) })
    .then((data) => {
      if (!data) {
        res.status(404).json({ message: 'Not found' });
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post('/products', (req, res) => {
  const { name, client } = req.body;
  const newProduct = {
    _id: ObjectId(), 
    name,
    client
  };

  req.db
    .collection('products')
    .insertOne(newProduct)
    .then(() => {
      res.status(201).json({ message: 'Product added', product: newProduct });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.put('/products/:id', (req, res) => {
  const { name, client } = req.body;

  req.db
    .collection('products')
    .updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { name, client } }
    )
    .then((result) => {
      if (result.matchedCount === 0) {
        res.status(404).json({ message: 'Not found' });
      } else {
        res.json({ message: 'Product updated' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.delete('/products/:id', (req, res) => {
  req.db
    .collection('products')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'Not found' });
      } else {
        res.json({ message: 'Product deleted' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

module.exports = router;

const express = require('express');
const router = new express.Router();
const items = require('../fakeDb');
const ExpressError = require('../expressError');


router.get("", (req, res, next) => {
  try {
    return res.json({ items });
  } catch (err) {
    return next(err)
  }
});


router.post("", (req, res, next) => {
  try {
    const newItem = {name: req.body.name, price: req.body.price};
    if (!newItem.name) throw new ExpressError("Name is required", 400);
    if (!newItem.price) throw new ExpressError("Price is required", 400);
    if (newItem.price <= 0) throw new ExpressError("Not a valid price", 400);
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (err) {
    return next(err)
  }
});


router.get("/:name", (req, res, next) => {
  try {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found", 404);
    return res.json({ item: foundItem });
  } catch (err) {
    return next(err)
  }
});


router.patch("/:name", (req, res, next) => {
  try {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found", 404);
    const updatedItem = {name: req.body.name, price: req.body.price};
    foundItem.name = updatedItem.name;
    foundItem.price = updatedItem.price;
    return res.json({ updated: updatedItem });
  } catch (err) {
    return next(err)
  }
});


router.delete("/:name", (req, res, next) => {
  try {
    const foundItemIndex = items.findIndex(item => item.name === req.params.name);
    if (foundItemIndex === -1) throw new ExpressError("Item not found", 404);
    items.splice(foundItemIndex, 1);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err)
  }
});


module.exports = router;

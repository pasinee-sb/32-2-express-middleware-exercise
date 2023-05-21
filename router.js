const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb");

// const ITEMS = [
//   { name: "popsicle", price: 1.45 },
//   { name: "cheerios", price: 3.4 },
// ];

router.get("/", (req, res) => {
  res.json({ items: items });
});

router.get("/:name", (req, res) => {
  const foundItem = items.find((i) => i.name === req.params.name);
  if (!foundItem) {
    throw new ExpressError("Item not found", 404);
  }

  res.json({ item: foundItem });
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", function (req, res) {
  const foundItem = items.find((i) => i.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  res.json({ updated: foundItem });
});

router.delete("/:name", function (req, res) {
  const foundItem = items.find((i) => i.name === req.params.name);
  if (!foundItem) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(foundItem, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;

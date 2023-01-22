const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/products").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("products")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// recordRoutes.route("/record/:id").get(function (req, res) {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId(req.params.id) };
//   db_connect.collection("products").findOne(myquery, function (err, result) {
//     if (err) throw err;
//     res.json(result);
//   });
// });

recordRoutes.route("/products").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    amount: req.body.amount,
    unit: req.body.unit,
  };
  db_connect
    .collection("products")
    .findOne({ name: req.body.name }, function (err, res) {
      if (err) throw err;
      if (res == null) {
        db_connect.collection("products").insertOne(myobj, function (err, res) {
          if (err) throw err;
          response.json(res);
        });
      } else {
        response.send("Produkt już istnieje.");
      }
    });
});

recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newValues = {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    },
  };
  db_connect
    .collection("products")
    .updateOne(myquery, newValues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated successfully");
      response.json(res);
    });
});

recordRoutes.route("/:id").delete(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("products").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log(`1 document deleted: ${req.params.id}`);
    res.json(obj);
  });
});

module.exports = recordRoutes;

const express = require("express");
const db = require("./db");
const router = new express.Router();
const { NotFoundError } = require("./errorHandling");

//CREATE a dog
router.post("/", async function (req, res) {
  const { name, breed, age } = req.body;
  const results = await db.query(
    `
  INSERT INTO dogs (name, breed, age)
  VALUES ($1, $2, $3)
  RETURNING name, name, breed, age`,
    [name, breed, age]
  );
  const newDog = results.rows[0];
  return res.json({ added: newDog });
});

//GET list of dogs
router.get("/", async function (req, res) {
  const results = await db.query(`SELECT * FROM dogs`);
  const dogs = results.rows;
  return res.json({ dogs });
});

//GET dog by name
router.get("/:name", async function (req, res, next) {
  const name = req.params.name.toUpperCase();
  const results = await db.query(`SELECT * FROM dogs WHERE upper(name) = $1`, [
    name,
  ]);
  const dog = results.rows[0];
  if (!dog) {
    return next(new NotFoundError());
  }
  return res.json({ dog });
});

//UPDATE dog's name
router.patch("/:name", async function (req, res) {
  const prevName = req.params.name.toUpperCase();
  const { name } = req.body;
  const results = await db.query(
    `UPDATE dogs
    SET name = $1
    WHERE upper(name) = $2
    RETURNING name`,
    [name, prevName]
  );
  const updatedDog = results.rows[0].name;
  return res.json({ updated: updatedDog });
});

//DELETE dog
router.delete("/:name", async function (req, res, next) {
  const name = req.params.name.toUpperCase();
  const results = await db.query(
    `DELETE FROM dogs
    WHERE upper(name) = $1
    RETURNING name`,
    [name]
  );
  console.log(results.rows);
  if (!results.rowCount) {
    return next(new NotFoundError());
  }
  return res.json({ deleted: results.rows[0].name });
});

module.exports = router;

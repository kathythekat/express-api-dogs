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
  RETURNING id, name, breed, age`,
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

//GET dog by id
router.get("/:id", async function (req, res, next) {
  const name = req.params.id;
  const results = await db.query(`SELECT * FROM dogs WHERE id = $1`, [name]);
  const dog = results.rows;
  if (!dog.length) {
    return next(new NotFoundError());
  }
  return res.json({ dog });
});

//UPDATE dog
router.patch("/:id", async function (req, res) {
  const id = req.params.id;
  const { name } = req.body;
  const results = await db.query(
    `UPDATE dogs
    SET name = $1
    WHERE id = $2
    RETURNING name`,
    [name, id]
  );
  const updatedDog = results.rows[0].name;
  return res.json({ updated: updatedDog });
});

//DELETE dog
router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const results = await db.query(
    `DELETE FROM dogs
    WHERE id = $1
    RETURNING name`,
    [id]
  );
  if (!results.rowCount) {
    return next(new NotFoundError());
  }
  return res.json({ deleted: results.rows });
});

module.exports = router;

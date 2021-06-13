const express = require("express");
const db = require("./dogDB");
const router = new express.Router();
const { NotFoundError, BadRequestError } = require("./errorHandling");

/**
 * GET dogs
 * get list of dogs
 */
router.get("/", function (req, res) {
  console.log(req.headers);
  return res.json({ dogs: db.dogData });
});

/**
 * POST dogs
 * @param {id, name, breed, age}
 * @returns {woof: {{id, name, breed, age}}
 */
router.post("/", function (req, res) {
  if (req.body.name || req.body.breed || req.body.age) {
    throw new BadRequestError("Must include name, breed, and age");
  }
  db.dogData.push({
    id: req.body.id,
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  });

  return res.json({
    woof: {
      id: req.body.id,
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
    },
  });
});

/**
 * GET dog by name
 */

router.get("/:id", function (req, res, next) {
  const dogName = Number(req.params.id);
  const dogMatch = db.dogData.find((dog) => dog.id === dogName);
  if (dogMatch === undefined) {
    throw new NotFoundError();
  }
  return res.json(dogMatch);
});

/**
 * PATCH update dog's name
 */

router.patch("/:name", function (req, res) {
  const prevName = req.params.name;
  const newName = req.body.name;
  const matchingIdx = db.dogData.findIndex((dog) => dog.name === prevName);
  if (matchingIdx === -1) {
    throw new NotFoundError();
  }
  db.dogData[matchingIdx].name = newName;
  return res.json({
    updated: { name: newName },
  });
});

/**
 * DELETE dog
 */
router.delete("/:name", function (req, res) {
  const name = req.params.name;
  const idxToDelete = db.dogData.findIndex((dog) => dog.name === name);
  if (idxToDelete === -1) {
    throw new NotFoundError();
  }
  db.dogData.splice(idxToDelete, 1);
  return res.json({
    deleted: { name },
  });
});

module.exports = router;

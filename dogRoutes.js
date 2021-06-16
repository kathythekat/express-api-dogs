const express = require("express");
const db = require("./dogFakeDB");
const {
  getDogArray,
  addDog,
  updateDog,
  deleteDog,
} = require("./dogFileFunctions");
const router = new express.Router();
const { NotFoundError, BadRequestError } = require("./errorHandling");

/**
 * CREATE a new dog
 * @param {id, name, breed, age}
 * @returns {woof: {{id, name, breed, age}}
 */
router.post("/", function (req, res) {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    throw new BadRequestError("Must include name, breed, and age");
  }
  const { name, breed, age } = req.body;
  addDog({ name, breed, age });

  return res.json({
    added: {
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
    },
  });
});

/**
 * GET dogs
 * get list of dogs
 */
router.get("/", async function (req, res) {
  const dogs = await getDogArray();
  console.log(dogs);
  return res.json({ dogs });
});

/**
 * GET dog by name
 * @param req.params.name
 * @returns {name, breed, age}
 */

router.get("/:name", async function (req, res, next) {
  const dogs = await getDogArray();
  const dogName = req.params.name;
  const dogMatch = dogs.find((dog) => dog.name === dogName);
  if (dogMatch === undefined) {
    throw new NotFoundError();
  }
  return res.json(dogMatch);
});

/**
 * PATCH update dog's name
 */

router.patch("/:name", async function (req, res) {
  const dogs = await getDogArray();
  const prevName = req.params.name;
  const newName = req.body.name;
  const matchingIdx = dogs.findIndex((dog) => dog.name === prevName);
  if (matchingIdx === -1) {
    throw new NotFoundError();
  }
  updateDog(matchingIdx, newName);
  return res.json({
    updated: { name: newName },
  });
});

/**
 * DELETE dog
 */
router.delete("/:name", async function (req, res) {
  const dogs = await getDogArray();
  const name = req.params.name;
  const idxToDelete = dogs.findIndex((dog) => dog.name === name);
  if (idxToDelete === -1) {
    throw new NotFoundError();
  }
  deleteDog(idxToDelete);
  return res.json({
    deleted: { name },
  });
});

module.exports = router;

const fsP = require("fs").promises;

async function getDogArray() {
  try {
    const dogsJSON = await fsP.readFile("dogs.json", "utf-8");
    const dogs = JSON.parse(dogsJSON);
    return dogs.dogs;
  } catch (err) {
    console.log("Error reading file");
  }
}

async function addDog(newDog) {
  const dogArr = await getDogArray();
  dogArr.push(newDog);
  const dogsJSON = JSON.stringify({ dogs: dogArr });
  try {
    await fsP.writeFile("dogs.json", dogsJSON, "utf-8");
  } catch (err) {
    console.log("Unable to add to file.");
  }
}

async function updateDog(idx, newName) {
  const dogArr = await getDogArray();
  dogArr[idx].name = newName;
  const dogsJSON = JSON.stringify({ dogs: dogArr });
  try {
    await fsP.writeFile("dogs.json", dogsJSON, "utf-8");
  } catch (err) {
    console.log("Unable to update file.");
  }
}

async function deleteDog(idx) {
  const dogArr = await getDogArray();
  dogArr.splice(idx, 1);
  const dogsJSON = JSON.stringify({ dogs: dogArr });
  try {
    await fsP.writeFile("dogs.json", dogsJSON, "utf-8");
  } catch (err) {
    console.log("Unable to remove from file.");
  }
}

module.exports = { getDogArray, addDog, updateDog, deleteDog };

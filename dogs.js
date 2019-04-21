const fs = require("fs");

const express = require("express");

const router = express.Router();

/**
 * * load in dogs data
 */
const dogs = require("./dogs.json");

/**
 * # get all dogs
 */
router.get("/", (req, res) => {
	res.status(200).send(dogs);
});

/**
 * # add a new dog
 */
router.post("/", (req, res) => {
	let { name, owner, notes } = req.body;

	/**
	 * ! get an array of id's, get the max of it
	 * ! plus one to the max as the id of the new dog
	 * ! real database can handle this task
	 */
	let idArr = dogs.map(d => d.id);
	let id = Math.max(...idArr) + 1;

	/**
	 * * new dog
	 */
	let newDog = {
		id: id,
		name: name,
		owner: owner,
		notes: notes
	};

	/**
	 * * append new dog to existing dog array
	 */

	let json = [...dogs, newDog];

	/**
	 * # Writing to the storage
	 */

	fs.writeFile("./dogs.json", JSON.stringify(json), err => {
		if (err) {
			res.status(500).send({ error: "Error Writing to the database" });
		}
	});

	res.status(200).send({ message: "successfully saved", newDog: newDog });
});

/**
 *  #get one dog
 */
router.get("/:id", (req, res) => {
	let { id } = req.params;

	let dog = dogs.filter(i => {
		return i.id == id;
	});

	if (dog) {
		res.status(200).send(dog[0]);
	} else {
		res.status(204).send({ message: "No Dog Found!" });
	}
});

/**
 * #update a dog
 */
router.put("/:id", (req, res) => {
	let { id } = req.params;
	let { name, owner, notes } = req.body;

	let dogArr = dogs.filter((i, index) => {
		return i.id != id;
	});

	let updatedDog = {
		// id from body is string, need to cast to int
		id: parseInt(id),
		name: name,
		owner: owner,
		notes: notes
	};

	let json = [...dogArr, updatedDog];

	fs.writeFile("./dogs.json", JSON.stringify(json), err => {
		if (err) {
			res.status(500).send({ error: "Error Writing to the database" });
		}
	});

	res
		.status(200)
		.send({ message: "successfully updated", updatedDog: updatedDog });
});

/**
 * # delete a dog
 */
router.delete("/:id", (req, res) => {
	let { id } = req.params;

	let dogArr = dogs.filter(i => {
		return i.id != id;
	});

	fs.writeFile("./dogs.json", JSON.stringify(dogArr), err => {
		if (err) {
			res.status(500).send({ error: "Error deleting from the database" });
		}
	});

	res.status(200).send({ message: "successfully deleted" });
});

module.exports = router;

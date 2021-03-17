const express = require("express");
const Person = require("../models/Person");
const { getRelation } = require("./utils/_getRelation");
const relationshipGraph = require("./utils/_relationshipGraph");

const router = express.Router();

router.get("/", async (req, res) => {
  // Fetch people details
  try {
    if (req.params.id) {
      const person = await Person.findOne({ _id: req.params.id });
      if (!person) {
        return res
          .status(400)
          .send({ error: "Uh oh! The user doesn't exist." });
      }
      return res.status(201).send({ person });
    }
    const people = await Person.find();
    return res.status(201).send({ people });
  } catch (error) {
    console.log("Catched error");
    res.status(400).send({ error: "Something weird happened.", log: error });
  }
});

router.post("/add", async (req, res) => {
  // Create a new person
  try {
    if (!req.body.name) {
      return res.status(400).send({ error: "Some fields are missing." });
    }
    const person = new Person({
      name: req.body.name,
    });
    await person.save();

    res.status(201).send({ person });
  } catch (error) {
    console.log("Catched error");
    console.log(error);
    res
      .status(400)
      .send({ error: "Person with the same name already exists." });
  }
});

router.post("/relationships", async (req, res) => {
  const people = await Person.find();
  const [personOne, personTwo] = [req.body.people[0], req.body.people[1]];
  const relationship = new relationshipGraph(people);
  return res.status(200).send({
    relationship: relationship.getRelationships(personOne, personTwo, []),
  });
});
router.post("/add/relation", async (req, res) => {
  /* 
    Add a relation:
    {
      people: [Array(Person)],
      relationship: String
    }

    @note: array order matters for hierarchical stating
  */
  try {
    if (!req.body.people) {
      return res.status(400).send({ error: "People must be specified." });
    }
    if (!req.body.relationship) {
      return res.status(400).send({ error: "Relationship must be specified." });
    }
    for (const person of req.body.people) {
      if (!(await Person.findOne({ name: person }))) {
        return res
          .status(400)
          .send({ error: "One or many people do not exist." });
      }
    }
    const [personOne, personTwo] = req.body.people;

    const firstPerson = await Person.findOne({ name: personOne });

    for (const relationship of firstPerson.relationships) {
      if (relationship.person == personTwo) {
        return res
          .status(400)
          .send({ error: "Relationship already exists with the user." });
      }
    }

    const secondPerson = await Person.findOne({ name: personTwo });
    firstPerson.relationships.push({
      person: secondPerson._id,
      relation: req.body.relationship,
    });
    await firstPerson.save();
    console.log(firstPerson._id);

    secondPerson.relationships.push({
      person: firstPerson._id,
      relation: getRelation(req.body.relationship),
    });
    await secondPerson.save();

    return res.status(200).send({ firstPerson, secondPerson });
  } catch (error) {
    console.error(error);
    console.log("Catched error");
    res.status(400).send({ error: "Something went wrong." });
  }
});

router.get("/flushdb", async (req, res) => {
  await Person.collection.drop();
  res.status(200).send({ status: "Flushed DB successfully" });
});

module.exports = router;

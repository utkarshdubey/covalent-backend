const { Schema, model } = require("mongoose");

const personSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  relationships: [
    {
      person: {
        type: Schema.ObjectId,
      },
      relation: {
        type: String,
        maxlength: 255,
      },
    },
  ],
  timestamp: {
    type: String,
    default: new Date().getTime(),
  },
});

personSchema.methods.isRelated = function (id) {
  return model("Person").findOne({
    _id: id,
    relationships: { person: this.id },
  });
};

personSchema.statics.findConnections = function (id) {
  return this.aggregate([{
    $graphLookup: {
      from: "Person",
      startWith: "$relationships",
      connectFromField: "relation",
      connectToField: "person",
      as: "treeView"
    }
  }]);
}

const Person = model("Person", personSchema);
module.exports = Person;

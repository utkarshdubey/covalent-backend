const relationshipDictionary = {
    mother: "child",
    father: "child",
    child: "parent",
    son: "parent",
    dad: "child",
    mom: "child",
    daughter: "parent",
    "grand father": "grand child",
    "grand mother": "grand child",
    uncle: "nephew/neice",
    aunt: "nephew/neice",
    brother: "brother/sister",
    sister: "brother/sister",
    nephew: "uncle/aunt",
    neice: "aunt",
};
module.exports.getRelation = (relation) => {
    return relationshipDictionary[relation.toLowerCase()] || relation;
};

module.exports = class RelationshipGraph {
  constructor(fullGraph) {
    this.graph = fullGraph;
    this._normalized = {};
    fullGraph.forEach((x) => {
      this._normalized[String(x._id)] = x.relationships;
    });
  }
  getPerson(id) {
    return this._normalized[String(id)];
  }
  alreadyVisitedNode(list, val) {
    return list.find((x) => this.isEq(val, x));
  }
  isEq(src, target) {
    if (!target) return false;
    return String(src.id) === String(target.id || target);
  }
  nameById(id) {
    return this.graph.find((x) => String(x._id) === String(id)).name;
  }
  getRelationships(id, target, returnValue, visitedPaths, startRelation) {
    const fromPerson = this.getPerson(id);
    if (!fromPerson) return [];

    const tmpVisited = visitedPaths ? visitedPaths.slice() : [];
    const isBeginning= startRelation === void 0 // start point won't be related to self
    tmpVisited.push({
      id,
      name: this.nameById(id),
      relation: startRelation,
      isBeginning:isBeginning || void 0,
      done:false
    });

    fromPerson.forEach((obj) => {
      const tPerson = {
        id: obj.person,
        relationships: this.getPerson(obj.person),
        name: this.nameById(obj.person),
      };

      if (this.alreadyVisitedNode(tmpVisited, tPerson)) {
        return;
      }
      const _visited = tmpVisited.slice();
      if (this.isEq(tPerson, target)) {
        _visited.push({
          id: tPerson.id,
          name: tPerson.name,
          relation: obj.relation,
          done: true,
        });
        returnValue.push(_visited);
        return;
      }
      this.getRelationships(
        String(obj.person),
        target,
        returnValue,
        _visited,
        obj.relation
      );
    });
    return returnValue;
  }
};

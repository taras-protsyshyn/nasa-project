const { planets } = require("../../models/planets.models");

function getAllPlanets(req, res) {
  return res.json(planets);
}

module.exports = {
  getAllPlanets,
};

const { getAllPlanets } = require("../../models/planets.models");

function httpGetAllPlanets(req, res) {
  return res.json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};

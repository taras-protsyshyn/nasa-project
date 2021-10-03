const { getAllPlanets } = require("../../models/planets.models");

async function httpGetAllPlanets(req, res) {
  return res.json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};

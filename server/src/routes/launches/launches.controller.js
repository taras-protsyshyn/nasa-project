const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const pagination = getPagination(req.query);
  return res.json(await getAllLaunches(pagination));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  try {
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
      return res.status(400).json({
        error: "Miss required field",
      });
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
      return res.status(400).json({
        error: "Invalid launch date",
      });
    }

    const newLaunch = await scheduleNewLaunch(launch);

    return res.status(201).json(newLaunch);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const isLaunchExist = await existLaunchWithId(launchId);

  if (!isLaunchExist) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch was not aborted",
    });
  }

  return res.json({
    message: `Launch ${launchId} was aborted successfully`,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};

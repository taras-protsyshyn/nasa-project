const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  const res = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (res.status !== 200) {
    console.error("Problem with populateLaunches");
    throw new Error("Problem with populateLaunches");
  }

  const launchDocs = res.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((el) => el["customers"]);

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

async function findLatestLaunch() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  return latestLaunch ? latestLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER;
}

async function getAllLaunches({ skip, limit }) {
  return await launches.find({}, "-_id -__v").sort({ flightNumber: 1 }).skip(skip).limit(limit);
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existLaunchWithId(id) {
  return !!findLaunch({ flightNumber: id });
}

async function saveLaunch(launch) {
  return await launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await findLatestLaunch()) + 1;
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
    customers: ["UCP", "NASA"],
  };
  await saveLaunch(newLaunch);
  return newLaunch;
}

async function abortLaunchById(id) {
  const aborted = await launches.updateOne(
    { flightNumber: id },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  existLaunchWithId,
  scheduleNewLaunch,
  getAllLaunches,
  abortLaunchById,
};

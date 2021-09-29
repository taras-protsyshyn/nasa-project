const launches = new Map();

const startFlightNumber = 100;
let lastFlightNumber = startFlightNumber;

const launch = {
  flightNumber: startFlightNumber,
  mission: "Kepler",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function existLaunchWithId(id) {
  return launches.has(id);
}

function addNewLaunch(launch) {
  lastFlightNumber++;

  const newLaunch = {
    ...launch,
    flightNumber: lastFlightNumber,
    upcoming: true,
    success: true,
    customers: ["UCP", "NASA"],
  };

  launches.set(lastFlightNumber, newLaunch);

  return newLaunch;
}

function abortLaunchById(id) {
  const aborted = launches.get(id);

  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

module.exports = {
  existLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};

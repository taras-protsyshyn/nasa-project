# nasa-project

## Project scope

I use this project for learning base of backend development via nodejs.
Purpose of this project is dashboard for planing a nasa missions to habitable planets.  
Also this project was synchronize with SpaceX launches.

## Related resources

- [KOI Table](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative) - table from NASA with exoplanets. From here I got a list of the most potentially habitable planets
- [SpaceX-API](https://github.com/r-spacex/SpaceX-API) - api for integration with SpaceX's launches history

## Commands to run

- `npm run`
  - `install-server` - install dependencies for server,
  - `install-client` - install dependencies for client,
  - `install` - install dependencies for both
  - `server` - run server,
  - `client`- run client,
  - `watch` - run both,
  - `deploy` - build client and run the server,
  - `deploy-cluster` - build client and run the server via pm2,
  - `test` - run test for both

## Deployment instructions

As production env we use [docker](https://www.docker.com/) on [AWS ES2 instance](https://docs.aws.amazon.
com/ec2/index.html?nc2=h_ql_doc_ec2), for update production you must have access to [Docker Hub](https://docs.docker.com/docker-hub/) and EC2 instance. The first step will be to create and push a new version to the docker hub, and after it needs a manual update it version in our ES2 instance.

[link to live site](http://3.131.38.219:8000/)

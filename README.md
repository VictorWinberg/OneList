# OneList

[![Build](https://github.com/VictorWinberg/onelist/workflows/Build/badge.svg)](https://github.com/VictorWinberg/onelist/actions?query=workflow%3ABuild+branch%3Amaster)
[![codecov](https://codecov.io/gh/VictorWinberg/OneList/branch/master/graph/badge.svg)](https://codecov.io/gh/VictorWinberg/OneList)

Working Environment, Project | Ergonomics and Aerosol Technology

### Setup

- Set up environment variables, e.g. `npm run env:pull`
- Create postgres database, e.g. `npm run db:pull`
- Install dependencies: `npm run install:all` (or install separately: `npm install`, `cd client && npm install`, `cd ../server && npm install`)
- Start both client and server: `npm start`
  - Or start separately: `npm run client:serve` (frontend) and `npm run server:start` (backend)

"use strict";

require("source-map-support/register");

var _app = _interopRequireDefault(require("./app"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import {dbConnect} from 'utils/dbConnector'
//dbConnect( config, 0 )
const serverUp = app => {
  const server = app.listen(_config.default.port);
  process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason));
  server.on('listening', () => logger.info('Feathers application started on http://%s:%d', _config.default.host, _config.default.port));
};

serverUp(_app.default);

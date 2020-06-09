require('dotenv').config()
var config = require('12factor-config')

var cfg = config({
    host : {
        env      : 'APP_HOST',
        type     : 'string',
        default  : process.env.DEV_HOST,
        required : true,
    },
    port : {
        env      : 'APP_PORT',
        type     : 'integer',
        default  : '3030',
        required : true,
    },
    protocol : {
        env      : 'PROTOCOL',
        type     : 'string',
        default  : 'https',
        required : true,
    },
    redisUri : {
        env      : 'REDIS_URI',
        type     : 'string',
        default  : '',
        required : true,
    },
    dbUri : {
        env      : 'DB_URI',
        type     : 'string',
        default  : '',
        required : true,
    },
    searchLimit:{
        env      : 'SEARCH_LIMIT',
        default  : 200,
        required : true,
    },
    dbType : {
        env      : 'APP_DB_TYPE',
        type     : 'string',
        default  : 'noSQL',
        required : true,
    },
    secret : {
        env      : 'SECRET',
        type     : 'string',
        default  : '99294186737032fedad37dc2e847912e1',
        required : true,
    },
    errorUnAuthorized : {
        env      : 'ERROR_UNAUTHORIZED',
        type     : 'string',
        default  : 'error_unauthorized',
        required : true
    },
    companyName : {
        env      : 'COMPANY_NAME',
        type     : 'string',
        default  : 'Ducatus',
        required : true,
    },
    env : {
      env      : 'NODE_ENV',
      type     : 'enum',
      default  : 'development',
      values   : ['development', 'production', 'test'],
    }
})

module.exports = cfg

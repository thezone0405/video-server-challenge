import app from './app'
import config from '../config'
import {dbConnect} from './utils/dbConnector'

dbConnect( config, 0 )

const serverUp = ( app ) => {
	const server = app.listen( config.port )
	process.on( 'unhandledRejection', ( reason, p ) =>
		console.log( 'Unhandled Rejection at: Promise ', p, reason )
	)
	server.on( 'listening', () =>
    console.log( 'application started on http://%s:%d', config.host,  config.port )
	)
}
serverUp( app )
'use strict' 
import mongoose from 'mongoose'
import config from '../../config'

export const mongooseConnect = config.dbUri

export const dbConnect = ( config, test = 1 ) => {
	if ( config.dbType == 'noSQL' ) {
		if ( mongoose.connection.readyState == 0 ) {
			mongoose.connect( mongooseConnect, {useNewUrlParser: true}).then( client => {
				if ( !test ) {
					console.log( 'Connected to database', 'noSQL' )
				}
			})
		}
	}
}

export const dbDrop = () => {
	try {
		mongoose.connection.dropDatabase( ()=> {
			console.log( 'Database has been dropped' )
			process.exit()
		})
	} catch ( e ) {
		console.log( e )
	}
}

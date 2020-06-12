'use strict'

import path from 'path'
import compress from 'compression'
import cookieSession from 'cookie-session'
import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import services from './routes'
import config from '../config'

const configuration = async ( req, res, next ) => {
	req.config = config
	req.currentUrl = config.env == 'production' ? config.host: `${config.host}:${config.port}`
	req.rootDir = path.join( __dirname,'/' )
	next()
}

const app = express()
app.use( cookieSession({name: 'session',	keys: [config.secret]}) )

app.use( cors() )
app.use( configuration )
app.use( helmet() )
app.use( compress() )
app.use( express.json() )
app.use( express.urlencoded({extended: true}) )
app.use( services )

export default app

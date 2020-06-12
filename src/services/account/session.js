'use strict'
import config from '../../../config'
import {encoder, decoder} from '../../utils/jwt'
import {user, } from '../../model/user'
import express from 'express'

const app = express.Router()

const encode = encoder({
	secret         : config.secret,
	expireInSeconds: 259200 // 72hours
})

const decode = decoder({
	secret: config.secret
})

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.post('/', async (req, res) => {
  try{
    const {username, password} = req.body
    const {_id} = await user.login(username, password)
    const payload = {_id, username}

    const token = encode(payload)
    response(200, {token}, res)
  }catch(e){
    response(400, {error: e.message}, res)
  }
})

app.put( '/', async ( req, res ) => {
	const {userID} = req.body
	const currentToken = req.header( 'authorization' )
	try {
    const decoded = decode( currentToken )
    if(decoded._id !== userID ){
      response( 401, {error: 'unauthorized_request'}, res)
      return
    }
		try {
			const {_id, username} = await user.findOne({_id: userID})
			const newToken = {token: encode({_id, username})}
			response( 200, newToken, res )
		} catch ( e ) {
			response( 401, {error: e.message}, res)
		}
	} catch ( e ) {
		response( 401, {error: e.message}, res)
	}
})

export default app

'use strict'
import config from '../../../config'
import {encoder, decoder} from '../../utils/jwt'
import {user} from '../../model/user'
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
    const {_id, mobileToken} = await user.login(username, password)
    const payload = {username, _id, mobileToken}

    const token = encode(payload)
    response(200, {token}, res)
  }catch(e){
    response(401, {error: e.message}, res)
  }
})

export default app

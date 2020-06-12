'use strict'
import express from 'express'
import sanitize from 'mongo-sanitize'
import {user} from '../../model/user'
import {encoder} from '../../utils/jwt'
import config from '../../../config'

const app = express.Router()

const encode = encoder({
	secret         : config.secret,
	expireInSeconds: 259200 // 72hours
})

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.post('/', async (req, res) => {
  const creds = sanitize(req.body)
  try{
    const {_id} = await user.register(creds)
    const payload = {_id}

    const token = encode(payload)
    response(200, {token}, res)
  }catch (e){
    response(400, {error: e.message}, res )
    console.log(e)
  }
})

export default app


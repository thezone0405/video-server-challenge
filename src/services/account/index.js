'use strict'
import express from 'express'
import sanitize from 'mongo-sanitize'
import {user} from '../../model/user'

const app = express.Router()

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.post('/', async (req, res) => {
  const creds = sanitize(req.body)
  try{
    const result = await user.register(creds)
    response(200, result, res )
  }catch (e){
    response(400, {error: e.message}, res )
    console.log(e)
  }
})

export default app


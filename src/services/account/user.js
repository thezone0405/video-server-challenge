'use strict'
import express from 'express'
import sanitize from 'mongo-sanitize'
import {user} from '../../model/user'

const app = express.Router()

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.get('/', async (req, res) => {
  try{
    const result = await user.find({isDeleted: false})
    response(200, result, res)
  }catch(e){
    console.log(e)
    response(400, {error: e.message}, res)
  }
})

app.get('/:username', async (req, res) => {
  const {username} = sanitize(req.params)
  try{
    const result = await user.findByUsername(username)
    response(200, result, res)
  }catch(e){
    console.log(e)
    response(404, {error: e.message}, res)
  }
})

export default app
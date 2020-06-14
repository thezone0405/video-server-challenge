import express from 'express'
import sanitize from 'mongo-sanitize'
import {castObjectId, validateObjectId, user} from '../../model/user'
import {conferenceRoom} from '../../model/conferenceRoom'
import config from '../../../config'
//import {user} from '../account/user'

const app = express.Router()

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.get('/user/:username', async (req, res) => {
  const {username} = sanitize(req.params)
  const matchedUser = await user.findOne({username}).populate('rooms')
  if(!matchedUser){
    response(404, {error: 'not_found'}, res)
    return
  }
  response(200, matchedUser.rooms , res)
})

app.get('/:id', async (req, res) => {
  const {id} = sanitize(req.params)
  if(!validateObjectId(id)){
    response(404, {error: 'not_found'}, res)
    return
  }
  const result = await conferenceRoom.findOne({_id: id})
  response(200, result , res)
})

export default app
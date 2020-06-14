import express from 'express'
import sanitize from 'mongo-sanitize'
import {user, validateObjectId} from '../../model/user'
import {conferenceRoom} from '../../model/conferenceRoom'
//import {user} from '../account/user'

const app = express.Router()

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.put('/join/:id', async (req, res) => {
  try{
    const {_id} = req.session
    const {id} = req.params

    if(!validateObjectId(id)){
      response(404, {error: 'not_found'}, res)
      return
    }
    await conferenceRoom.validRoom(_id, id)
    const result = await conferenceRoom.findOneAndUpdate({_id: id}, { $push: { participants: _id }}, {new: true})
    await user.findOneAndUpdate({_id}, { $push: { rooms: id }})
    response(200, result, res)
  }catch(e){
    console.log(e)
    response(400, {error: e.message}, res)
  }
})

app.put('/leave/:id', async (req, res) => {
  try{
    const {_id} = req.session
    const {id} = req.params

    if(!validateObjectId(id)){
      response(404, {error: 'not_found'}, res)
      return
    }
    await conferenceRoom.validRoomLeave(_id, id)
    const result = await conferenceRoom.findOneAndUpdate({_id: id}, { $pull: { participants: _id }}, {new: true})
    await user.findOneAndUpdate({_id}, { $pull: { rooms: id }})
    response(200, result, res)
  }catch(e){
    console.log(e)
    response(400, {error: e.message}, res)
  }
})

export default app
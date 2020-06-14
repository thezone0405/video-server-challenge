import express from 'express'
import sanitize from 'mongo-sanitize'
import {castObjectId, validateObjectId} from '../../model/user'
import {conferenceRoom} from '../../model/conferenceRoom'
import config from '../../../config'
import {user} from '../account/user'

const app = express.Router()

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.post('/', async (req, res) => {
  const {_id} = req.session
  const {name, capacity } = sanitize(req.body)
  try{
    const result = await conferenceRoom.create({
      host: castObjectId(_id),
      capacity,
      name,
      participants: [castObjectId(_id)]
    })
    response(200, result, res)
  }catch(e){
    console.log(e)
    response(400, e.message, res)
  }
})

app.put('/:id', async (req, res) => {
  const {_id} = req.session
  const updates = sanitize(req.body)
  const {id} = req.params
  try{
    let roomUpdates = updates
    if(updates.newHostID){
      const {userID} = await conferenceRoom.validIDs(updates.newHostID, id)
      roomUpdates = Object.assign(updates, {
        host: userID
      })
    }
    if(!validateObjectId(id)){
      response(404, {error: 'not_found'}, res)
      return
    }
    const result = await conferenceRoom.findOneAndUpdate({_id: id, host: castObjectId(_id)}, roomUpdates, {new: true})
    if(!result){
      response(401, {error: 'unauthorized'} , res)
      return
    }
    response(200, result, res)
  }catch(e) {
    console.log(e)
    response(400, {error: e.message}, res)
  }
})

export default app
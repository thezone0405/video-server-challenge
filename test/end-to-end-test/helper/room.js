import {host} from './index'
import {conferenceRoom} from 'model/conferenceRoom'
import {castObjectId, user} from 'model/user'
import faker from 'faker'
import axios from 'axios'

export const createRoom = async (userID, setcapacity = null) => {
  const newRoom = {
    name: faker.random.words(),
    capacity: setcapacity || Math.floor(  Math.random() * (10 - 3) + 3 ),
    host: castObjectId(userID),
    participants: [castObjectId(userID)]
  }

  const result = await conferenceRoom.create(newRoom)
  await user.findOneAndUpdate({_id: userID}, { $push: { rooms: result._id }})
  return result
}

export const createRoomWithParticipants = async (userID, participants = [], setcapacity = null) => {
  const objIdParticipants = participants.map( id => castObjectId(id) )
  const newRoom = {
    name: faker.random.words(),
    capacity: setcapacity || Math.floor(  Math.random() * (10 - 3) + 3 ),
    host: castObjectId(userID),
    participants: [castObjectId(userID), ...objIdParticipants]
  }

  const result = await conferenceRoom.create(newRoom)
  result.participants.map( async userId => await user.findOneAndUpdate({_id: userId}, { $push: { rooms: result._id }}) )
  return result
}
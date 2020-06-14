import {host} from './index'
import {conferenceRoom} from 'model/conferenceRoom'
import {castObjectId} from 'model/user'
import faker from 'faker'
import axios from 'axios'

export const createRoom = async (userID, setcapacity = null) => {
  const newRoom = {
    name: faker.random.words(),
    capacity: setcapacity || Math.floor(  Math.random() * (10 - 3) + 3 ),
    host: castObjectId(userID),
    participants: [castObjectId(userID)]
  }

  return await conferenceRoom.create(newRoom)
}

export const createRoomWithParticipants = async (userID, participants = [], setcapacity = null) => {
  const objIdParticipants = participants.map( id => castObjectId(id) )
  const newRoom = {
    name: faker.random.words(),
    capacity: setcapacity || Math.floor(  Math.random() * (10 - 3) + 3 ),
    host: castObjectId(userID),
    participants: [castObjectId(userID), ...objIdParticipants]
  }

  return await conferenceRoom.create(newRoom)
}
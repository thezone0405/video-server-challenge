import {host} from './index'
import {conferenceRoom} from 'model/conferenceRoom'
import {castObjectId} from 'model/user'
import faker from 'faker'
import axios from 'axios'

export const createRoom = async (userID) => {
  const newRoom = {
    name: faker.random.words(),
    capacity: Math.floor(  Math.random() * 10  + 1 ),
    host: castObjectId(userID),
    participants: [castObjectId(userID)]
  }

  return await conferenceRoom.create(newRoom)
}

export const createRoomWithParticipants = async (userID, participants = []) => {
  const objIdParticipants = participants.map( id => castObjectId(id) )
  const newRoom = {
    name: faker.random.words(),
    capacity: Math.floor(  Math.random() * 10  + 1 ),
    host: castObjectId(userID),
    participants: [castObjectId(userID), ...objIdParticipants]
  }

  return await conferenceRoom.create(newRoom)
}
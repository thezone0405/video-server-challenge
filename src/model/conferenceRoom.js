'use strict'
import config from '../../config'
import mongoose from 'mongoose'

const {Schema} = mongoose

const schema = new Schema({
	name: {
		type    : String,
		required  : true,
	},
	capacity: {
		type    : Number,
		default: 5
  },
  participants: [{
		type: Schema.ObjectId,
		ref : 'Users'
	}],
  host: {
		type: Schema.ObjectId,
		ref : 'Users'
  },
  active: {
    type: Boolean,
    default: true
  }
})

export class ConferenceRoomClass {
  static async validIDs(userID, roomID){
    const room = await this.findOne({_id:roomID}).exec()
    if(!room){
      throw new Error("not_found")
    }
    if(!room.participants.includes(userID)){
      throw new Error("user_not_participant")
    }
    return {userID, roomID: room._id}
  }

  static async validRoom(userID, roomID){
    const room = await this.findOne({_id: roomID}).exec()
    if(!room){
      throw new Error("not_found")
    }
    if(room.participants.includes(userID)){
      throw new Error("already_joined")
    }
    if(room.participants.length >= room.capacity){
      throw new Error("room_full")
    }
    return true
  }

  static async validRoomLeave(userID, roomID) {
    const room = await this.findOne({_id: roomID}).exec()
    if(!room){
      throw new Error("not_found")
    }
    if(!room.participants.includes(userID)){
      throw new Error("user_not_in_room")
    }
    return true
  }
}

schema.loadClass( ConferenceRoomClass )
export const conferenceRoom = mongoose.model('ConferenceRooms', schema)
import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host, randomUsername} from '../helper'
import {login, createUser} from '../helper/user'
import {castObjectId, user} from 'model/user'
import {createRoom, createRoomWithParticipants} from '../helper/room'

let dummyUser, dummyUser2, dummyUser3, dummyUser4, room, roomWithParticipants
beforeAll( async () => {
  dbConnect( config )
  dummyUser = await createUser()
  dummyUser2 = await createUser()
  dummyUser3 = await createUser()
  dummyUser4 = await createUser()
  room = await createRoom(dummyUser2._id, 2)
  roomWithParticipants = await createRoomWithParticipants(dummyUser2._id, [dummyUser._id, dummyUser3._id])
})

describe("Joining", () => {
  test("Successfully joins a user", async () => {
    await login(dummyUser.username, "passw0rd")
    const response = await apiCall.put(`${host}/conference/join/${room._id}`)

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.participants ).toContain( dummyUser._id.toString() )

    const userData = await user.findOne({_id: dummyUser._id})
    expect( userData.rooms ).toContainEqual( room._id )
  })

  test("Rejects user to join if user is already in room", async () => {
    try{
      const response = await apiCall.put(`${host}/conference/join/${room._id}`)

      expect( response.status ).toEqual( 400 )
    }catch(e){
      expect( e.response.data.error ).toEqual('already_joined')
    }
  })

  test("Rejects user to join if capacity is reached", async () => {
    await login(dummyUser4.username, "passw0rd")
    try{
      const response = await apiCall.put(`${host}/conference/join/${room._id}`)

      expect( response.status ).toEqual( 400 )
    }catch(e){
      expect( e.response.data.error ).toEqual('room_full')
    }
  })

  test("Rejects user to join if room is not found", async () => {
    await login(dummyUser4.username, "passw0rd")
    try{
      const response = await apiCall.put(`${host}/conference/join/sadf23r2fw`)

      expect( response.status ).toEqual( 404 )
    }catch(e){
      expect( e.response.data.error ).toEqual('not_found')
    }
  })
})

describe("Leave", () => {
  test("Successfully leaves a conference", async () => {
    await login(dummyUser.username, "passw0rd")
    const response = await apiCall.put(`${host}/conference/leave/${room._id}`)

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.participants ).toEqual(
      expect.not.arrayContaining([dummyUser._id.toString()]),
    )

    const userData = await user.findOne({_id: dummyUser._id})
    expect( userData.rooms ).toEqual(
      expect.not.arrayContaining([room._id]),
    )
  })

  test("Rejects user if room is not found", async () => {
    try{
      const response = await apiCall.put(`${host}/conference/leave/sadf23r2fw`)

      expect( response.status ).toEqual( 404 )
    }catch(e){
      expect( e.response.data.error ).toEqual('not_found')
    }
  })

  test("Rejects user if user is not a participant", async () => {
    try{
      const response = await apiCall.put(`${host}/conference/leave/${room._id}`)

      expect( response.status ).toEqual( 400 )
    }catch(e){
      expect( e.response.data.error ).toEqual('user_not_in_room')
    }
  })
})
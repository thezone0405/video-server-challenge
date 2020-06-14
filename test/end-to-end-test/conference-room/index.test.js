import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host, randomUsername} from '../helper'
import {login, createUser} from '../helper/user'
import {createRoom, createRoomWithParticipants} from '../helper/room'

let dummyUser, dummyUser2, dummyUser3, dummyUser4, room, roomWithParticipants
beforeAll( async () => {
  dbConnect( config )
  dummyUser = await createUser()
  dummyUser2 = await createUser()
  dummyUser3 = await createUser()
  dummyUser4 = await createUser()
  room = await createRoom(dummyUser2._id)
  roomWithParticipants = await createRoomWithParticipants(dummyUser2._id, [dummyUser._id, dummyUser3._id])
})

describe("Create room", () => {
  test("Successfully creates new conference room", async () => {
    await login(dummyUser.username, "passw0rd")
    const response = await apiCall.post(`${host}/room`, {
      name: 'Sample conference room',
      capacity: 7
    })

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.name ).toEqual( "Sample conference room" )
    expect( response.data.capacity ).toEqual( 7 )
    expect( response.data.host ).toEqual( dummyUser._id.toString() )
    expect( response.data.participants ).toContain( dummyUser._id.toString() )
  })
})

describe("Update room", () => {
  test("Successfully updates a room", async () => {
    await login(dummyUser2.username, "passw0rd")
    const response = await apiCall.put(`${host}/room/${room._id}`, {
      name: 'Test conference room update',
      capacity: 15,
    })

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.name ).toEqual( 'Test conference room update' )
    expect( response.data.capacity ).toEqual( 15 )
    expect( response.data.host ).toEqual( dummyUser2._id.toString() )
  })

  test("Reject update if new host is not a participant", async () => {
    try{
      const response = await apiCall.put(`${host}/room/${roomWithParticipants._id}`, {
        newHostID: dummyUser4._id
      })
      console.log(response)
      expect( response.status ).toEqual( 400 )
    }catch(e){
      expect( e.response.data.error ).toEqual('user_not_participant')
    }
  })

  test("Successfully updates a room's host with valid participants", async () => {
    const response = await apiCall.put(`${host}/room/${roomWithParticipants._id}`, {
      name: 'Test conference room host update',
      capacity: 20,
      newHostID: dummyUser._id
    })

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.name ).toEqual( 'Test conference room host update' )
    expect( response.data.capacity ).toEqual( 20 )
    expect( response.data.host ).toEqual( dummyUser._id.toString() )
  })

  test("Reject update if host is not current user", async () => {
    try{
      const response = await apiCall.put(`${host}/room/${roomWithParticipants._id}`, {
        name: 'Test conference room reject update',
        capacity: 12
      })

      expect( response.status ).toEqual( 401 )
    }catch(e){
      expect( e.response.data.error ).toEqual('unauthorized')
    }
  })

  test("Reject update if new host is not a participant", async () => {
    try{
      const response = await apiCall.put(`${host}/room/${roomWithParticipants._id}`, {
        name: 'Test conference room reject update',
        capacity: 12
      })

      expect( response.status ).toEqual( 401 )
    }catch(e){
      expect( e.response.data.error ).toEqual('unauthorized')
    }
  })

  test("Reject update if room id doesn't exists", async () => {
    try{
      const response = await apiCall.put(`${host}/room/123sdfw4e2dwssd`, {
        name: 'Test conference room reject update',
        capacity: 10
      })

      expect( response.status ).toEqual( 400 )
    }catch(e){
      expect( e.response.data.error ).toEqual('not_found')
    }
  })
})
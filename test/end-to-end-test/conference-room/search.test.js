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

describe("Search users rooms", () => {
  test("Returns a list of rooms a user is in", async () => {
    const response = await apiCall.get(`${host}/room-search/user/${dummyUser2.username}`)

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.length ).toBeGreaterThanOrEqual(1)
  })
})

describe("Room data view", () => {
  test("Returns room data view", async () => {
    const response = await apiCall.get(`${host}/room-search/${room._id}`)

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.name ).toEqual( room.name )
    expect( response.data.capacity ).toEqual( room.capacity )
    expect( response.data.host ).toEqual( room.host.toString() )
  })
})
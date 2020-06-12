'use strict'
import {decoder} from 'utils/jwt'
import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host} from '../helper'
import {createUser, login} from '../helper/user'
import {castUserId} from 'model/user'

const decode = decoder({
	secret: config.secret
})

let dummyUser
beforeAll( async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000
  dbConnect( config )
  dummyUser = await createUser()
})

describe("Session Creation", () => {
  test("Returns JWT for user with valid credentials", async () =>{
    const {username} = dummyUser
    const response = await apiCall.post(`${host}/session/?test=test`, { username, password: 'passw0rd' })
    const decoded = decode(response.data.token)

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( castUserId(decoded._id) ).toEqual( dummyUser._id )
  })

  test("Rejects login for invalid credentials", async () =>{
    try{
      const {username} = dummyUser
      await apiCall.post(`${host}/session`, { username, password: 'passweird' })
    }catch(e){
      expect( e.response.data.error ).toEqual('incorrect_username_password')
    }
    
  })
})

describe("Update Session", () => {
  test("Rejects session update if Authorization is not present", async () =>{
    try{
      const {_id} = dummyUser 
      const response = await apiCall.put(`${host}/session`, {userID: _id})
    }catch(e){
      expect( e.response.data.error ).toBe('unauthorized_request')
    }
  })

  test("Updates jwt on apicall", async () =>{
    const {username, _id} = dummyUser
    await login(username, "passw0rd")    
    const response = await apiCall.put(`${host}/session`, {userID: _id})

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
  })
})
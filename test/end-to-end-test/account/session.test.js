'use strict'
import {decoder} from 'utils/jwt'
import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host} from '../helper'
import {createUser} from '../helper/user'

const decode = decoder({
	secret: config.secret
})

let dummyUser
beforeAll( async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000
  dbConnect( config )
  dummyUser = await createUser()
})

describe("Session", () => {
  test("Returns JWT for user with valid credentials", async () =>{
    const {username} = dummyUser
    const response = await apiCall.post(`${host}/session`, { username, password: 'passw0rd' })
    const decoded = decode(response.data.token)

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( decoded.username ).toEqual( dummyUser.username )
    expect( decoded.mobileToken ).toEqual( dummyUser.mobileToken )
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
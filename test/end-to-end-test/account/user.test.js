import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host} from '../helper'
import {createUser} from '../helper/user'

let dummyUser
beforeAll( async () => {
  dbConnect( config )
  dummyUser = await createUser()
})

describe("User listing", () => {
  test("Returns a list of user", async () => {
    const response = await apiCall.get(`${host}/user`)
    
    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.length ).toBeGreaterThanOrEqual(1)
  })
})

describe("User view", () => {
  test("Returns user data for existing username", async () => {
    const response = await apiCall.get(`${host}/user/${dummyUser.username}`)

    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( response.data.username ).toEqual( dummyUser.username )
  })

  test("Returns not found error for non existing username", async () => {
    try{
      const response = await apiCall.get(`${host}/user/nonexistinguser21345`)
    }catch(e){
      expect( e.response.data.error ).toBe('not_found')
    }
  })
})
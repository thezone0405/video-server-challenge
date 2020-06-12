import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host, randomUsername} from '../helper'
import {castUserId} from 'model/user'
import {decoder} from 'utils/jwt'

const decode = decoder({
	secret: config.secret
})

let username
beforeAll( async () => {
	dbConnect( config )
})

describe("Registration", () => {
  test("Successfully registers a user with unique username and returns JWT", async () => {
    username = randomUsername()
    const response = await apiCall.post(`${host}/account`, {
      username,
      password: "passw0rd"
    })
    const decoded = decode(response.data.token)
    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
    expect( castUserId(decoded._id) ).toBeTruthy()
  })

  test("Rejects registration for duplicate username", async () => {
    try {
			const response = await apiCall.post(`${host}/account`, {
        username,
        password: "passw0rd"
      })
		} catch ( e ){
			expect( e.response.data.error ).toEqual( 'duplicate_username' )
		}
	})
})


import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host, randomUsername} from '../helper'

let createdUser
beforeAll( async () => {
	dbConnect( config )
})

describe("Registration", () => {
  test("Successfully registers a user with unique username", async () => {
    const response = await apiCall.post(`${host}/account`, {
      username: randomUsername(),
      password: "passw0rd"
    })

    createdUser = response.data
    expect( response.status ).toEqual( 200 )
    expect( response.data ).toBeTruthy()
  })

  test("Rejects registration for duplicate username", async () => {
    try {
			const response = await apiCall.post(`${host}/account`, {
        username: createdUser.username,
        password: "passw0rd"
      })
		} catch ( e ){
			expect( e.response.data.error ).toEqual( 'duplicate_username' )
		}
	})
})


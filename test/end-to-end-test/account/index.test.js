import config from '../../../config'
import {dbConnect} from 'utils/dbConnector'
import {apiCall, host, randomUsername} from '../helper'
import {login, createUser} from '../helper/user'
import {castUserId, user} from 'model/user'
import {decoder} from 'utils/jwt'
import {PASSWORD_SALT} from 'model/user'
import {hash} from 'utils/password'

const decode = decoder({
	secret: config.secret
})

let username, dummyUser, dummyUser2
beforeAll( async () => {
  dbConnect( config )
  dummyUser = await createUser()
  dummyUser2 = await createUser()
})

describe("Registration", () => {
  test("Successfully registers a user with unique username and returns JWT", async () => {
    username = await randomUsername()
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

describe("Account update", () => {
  test("Successfully updates user's password", async () => {
    await login(dummyUser.username, "passw0rd")
    const response = await apiCall.put(`${host}/account`,{password:"passw0rd", newPassword: "p6ssword"})

    expect(response.status).toEqual(200)
    expect(response.data).toBeTruthy()
    expect(response.data.password).toEqual(hash('p6ssword', PASSWORD_SALT))
  })

  test("Successfully updates user's mobileToken", async () => {
    const response = await apiCall.put(`${host}/account`,{mobileToken: "new_token"})

    expect(response.status).toEqual(200)
    expect(response.data).toBeTruthy()
    expect(response.data.mobileToken).toEqual("new_token")
    expect(response.data.password).toEqual(hash('p6ssword', PASSWORD_SALT))
  })
  
  test("Successfully updates user's mobileToken and password", async () => {
    const response = await apiCall.put(`${host}/account`,{mobileToken: "new2_token", password:"p6ssword", newPassword: "passw0rd"})

    expect(response.status).toEqual(200)
    expect(response.data).toBeTruthy()
    expect(response.data.mobileToken).toEqual("new2_token")
    expect(response.data.password).toEqual(hash('passw0rd', PASSWORD_SALT))
  })

  test("Rejects password update if old password didn't match", async () => {
    try{
      const response = await apiCall.put(`${host}/account`,{password:"p6ssweird", newPassword: "p6ssw0rd"})

      expect(response.status).toEqual(400)
      expect(response.data).toBeFalsy()
    }catch(e){
      expect( e.response.data.error ).toEqual( 'incorrect_old_password' )
    }
  })
})

describe("Account Delete", () => {
  test("Soft deletes an account", async () => {
    await login(dummyUser2.username, "passw0rd")
    const response = await apiCall.put(`${host}/account/delete`)

    expect(response.status).toEqual(200)
    expect(response.data).toBeTruthy()
    expect(response.data.isDeleted).toBeTruthy()
  })

  test("Hard deletes an account", async () => {
    const response = await apiCall.delete(`${host}/account`)

    const isDeleted = await user.findOne({_id: dummyUser2._id})

    expect(response.status).toEqual(200)
    expect(response.data).toBeTruthy()
    expect(isDeleted).toBeFalsy()
  })
})


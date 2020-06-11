import {UserClass, PASSWORD_SALT} from 'model/user'
import {hash} from 'utils/password'

const LOGIN = {
  username: "edztest",
  password: "passw0rd"
}

const VERIFIED = {
	username   : LOGIN.username,
	password: hash( LOGIN.password, PASSWORD_SALT )
}

const UPDATE_CREDS = {
  _id: "sample_id",
  oldPassword: LOGIN.password,
}
const UPDATE = {
  password: "p6ssword",
  mobileToken: "test_token"
}
const UPDATED = {
  _id : UPDATE_CREDS._id,
  username: LOGIN.username,
  password: hash(UPDATE_CREDS.oldPassword, PASSWORD_SALT),
  mobileToken: UPDATE_CREDS.mobileToken
}

const mock = options => {
	class User extends UserClass {
		static findOne ( opts ) {
			const result = new Promise( ( resolve ) => {
				resolve( options.findOne( opts ) )
			})
			result.exec = () => result
			return result
		}
		static create ( opts ) {
			const result = new Promise( ( resolve ) => {
				resolve( options.create( opts ) )
			})
			result.exec = () => result
			return result
		}
	}
	return User
}

describe("Registration", () => {
  test("Successfully registers a user", async () => {
    const create = jest.fn()
    const findOne = jest.fn()
    create.mockReturnValueOnce( VERIFIED )
    findOne.mockReturnValueOnce(null)
    const result = await expect(
      mock({
        create,
        findOne
      }).register(LOGIN)
    ).resolves.toMatchObject(VERIFIED)
    
    expect( create.mock.calls.length ).toBe( 1 )
    expect( create.mock.calls[ 0 ].length ).toBe( 1 )
    expect( create.mock.calls[ 0 ][ 0 ] ).toEqual({
      username    : LOGIN.username,
      password : VERIFIED.password
    })
    return result
  })

  test("Rejects duplicate username", async () => {
    const create = jest.fn()
    const findOne = jest.fn()
    create.mockReturnValueOnce( VERIFIED )
    findOne.mockReturnValueOnce(VERIFIED)
    const result = await expect(
      mock({
        create,
        findOne
      }).register(LOGIN)
    ).rejects.toMatchObject({message: "duplicate_username"})
  
    expect( create.mock.calls.length ).toBe( 0 )
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ username: LOGIN.username })
    return result
  })
})

describe("Login", () => {
  test("Returns credentials to logging in user", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce(VERIFIED)
    const result = await expect(
      mock({
        findOne
      }).login(LOGIN.username, LOGIN.password)
    ).resolves.toMatchObject(VERIFIED)

    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual(VERIFIED)
    return result
  })

  test("Rejects invalid credentials", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce(undefined)
    const result = await expect(
      mock({
        findOne
      }).login(LOGIN.username, "invalid_password")
    ).rejects.toMatchObject({message: "incorrect_username_password"})

    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({
      username: LOGIN.username,
      password: hash("invalid_password", PASSWORD_SALT)
    })
    return result
  })
})




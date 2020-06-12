import {randomUsername, apiCall} from './index'
import {user} from 'model/user'
import faker from 'faker'

export const createUser = async () => {
  const newUser = {
    username: randomUsername(),
    mobileToken: faker.random.alphaNumeric(),
    password: 'passw0rd'
  }

  return await user.register(newUser)
}
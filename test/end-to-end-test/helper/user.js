import {randomUsername, host} from './index'
import {user} from 'model/user'
import faker from 'faker'
import axios from 'axios'

export const createUser = async () => {
  const newUser = {
    username: await randomUsername(),
    mobileToken: faker.random.alphaNumeric(),
    password: 'passw0rd'
  }

  return await user.register(newUser)
}

export const login = async (username, password) => {
  const response = await axios.post(`${host}/session`, {username, password})
  axios.defaults.headers.common[ 'Authorization' ] = response.data.token
}
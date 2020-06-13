import config from '../../../config'
import axios from 'axios'
import faker from 'faker'
import {user} from 'model/user'

export const host = `http://${config.host}:${config.port}`

export const apiCall = axios

const randomizer = () => Math.floor(  Math.random() * 10000  + 1 )
export const randomUsername = async () => {
  const username = `${faker.internet.userName()}_${randomizer()}`
  const duplicate = await user.findOne({username})
  if( !duplicate ){
    return username
  }
  randomUsername()
}
import config from '../../../config'
import axios from 'axios'
import faker from 'faker'

export const host = `http://${config.host}:${config.port}`

export const apiCall = axios

const randomizer = () => Math.floor(  Math.random() * 10000  + 1 )
export const randomUsername = () => `${faker.internet.userName()}_${randomizer()}`
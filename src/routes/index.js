'use strict'
import account from '../services/account'
import session from '../services/account/session'
import user from '../services/account/user'
import conferenceRoom from '../services/room'
import conference from '../services/room/conference'

import {authorizer} from '../utils/authorizer'
import express from 'express'

const app = express()

app.use('/account', authorizer(['POST/']), account)
app.use('/session', authorizer(['POST/']), session)
app.use('/user', user)

app.use('/room', authorizer(['GET/user']), conferenceRoom)
app.use('/conference', authorizer(), conference)

export default app
'use strict'
import account from '../services/account'
import session from '../services/account/session'

import {authorizer} from '../utils/authorizer'
import express from 'express'

const app = express()

app.use('/account', account)
app.use('/session', authorizer(['POST/']), session)

export default app
'use strict'
import account from '../services/account'
import session from '../services/account/session'

import express from 'express'

const app = express()

app.use('/account', account)
app.use('/session', session)

export default app
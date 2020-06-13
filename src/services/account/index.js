'use strict'
import express from 'express'
import sanitize from 'mongo-sanitize'
import {user, castUserId} from '../../model/user'
import {encoder} from '../../utils/jwt'
import config from '../../../config'
import {hash, isValidPassword} from '../../utils/password'

const app = express.Router()

const encode = encoder({
	secret         : config.secret,
	expireInSeconds: 259200 // 72hours
})

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) ) 
}

app.post('/', async (req, res) => {
  const creds = sanitize(req.body)
  try{
    const {_id, username} = await user.register(creds)
    const payload = {_id, username}

    const token = encode(payload)
    response(200, {token}, res)
  }catch (e){
    response(400, {error: e.message}, res )
    console.log(e)
  }
})

app.put('/', async (req, res) => {
  let creds = req.body
  const {_id} = req.session
  let result
  try{
    if(creds.password && creds.newPassword){
      const {password, newPassword} = creds
      result = await user.findOneAndUpdate({
        _id: castUserId(_id), 
        password: hash(password, config.secret)
      }, Object.assign(creds, {password: hash(newPassword, config.secret)}), {new: true})
      if(!result){
        response(400, {error:'incorrect_old_password'}, res )
        return
      }
      response(200, result, res )
      return
    }
    delete creds.password
    delete creds.isDeleted
    result = await user.findOneAndUpdate({_id: castUserId(_id)}, creds, {new: true})
    response(200, result, res )
    return
  }catch(e){
    console.log(e)
    response(400, {error: e.message}, res)
  }
})

app.put('/delete', async (req, res) => {
  try{
    const {_id} = req.session
    const result = await user.findOneAndUpdate({
      _id: castUserId(_id), 
    }, {isDeleted: true}, {new: true})
    response(200, result, res )
  }catch(e){
    console.log(e)
    response(400, {error: e.message}, res)
  }
})

app.delete('/',async (req, res) => {
  try{
    const {_id} = req.session
    const result = await user.findOneAndRemove({_id: castUserId(_id)})
    response(200, result, res )
  }catch(e){
    console.log(e)
    response(400, {error: e.message}, res)
  }
})

export default app


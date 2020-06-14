import {castObjectId} from '../model/user'
import {decoder} from '../utils/jwt'
import config from '../../config'

export const authorizer = ( exception = []) => ( async (req, res, next) => {
  if(exception.includes(req.method+req.path)){
    next()
    return
  }
  const token = req.header( 'authorization' )
  try{
    const {_id} =  decoder({secret: config.secret})( token )
    req.session = {_id}
    next()
    return
  }catch(e){
    console.log(e)
    res.status( 401 ).send({error: 'unauthorized_request'})
    return
  }
})
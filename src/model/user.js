'use strict'
import config from '../../config'
import mongoose from 'mongoose'
import {hash, isValidPassword} from 'utils/password'

const {Schema} = mongoose

export const PASSWORD_SALT = config.secret

const schema = new Schema({
	username: {
		type    : String,
		required  : true,
		unique    : 'username_already_registered',
		index     : true,
		searchable: true,
		lowercase : true
	},
	password: {
		type    : String,
		required: true
  },
  mobileToken: {
		type    : String,
		default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

export class UserClass {
  static async register (user){
    let userData = {}
    const duplicate = await this.findOne({username: user.username}).exec()
    
    if ( duplicate ){
			throw new Error( 'duplicate_username' )
    }
    if ( !isValidPassword( user.password ) ) {
      throw new Error( 'invalid_password' )
    }
    
    const created = await this.create(
			Object.assign( userData, user, {
				password: user.password && hash( user.password, PASSWORD_SALT )
			})
    )
    
    return created
  }

  static async login(username, password){
    const authenticated = await this.findOne({username, password: hash(password, PASSWORD_SALT )}).exec()

    if(!authenticated){
      throw new Error('incorrect_username_password')
    }
    console.log(typeof this.Update)
    return authenticated
  }
}

schema.loadClass( UserClass )
export const user = mongoose.model( 'Users', schema )

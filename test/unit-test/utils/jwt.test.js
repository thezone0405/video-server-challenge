'use strict'

import {encoder, decoder} from 'utils/jwt'

test( 'jwt token encoded and decoded with same secret', () => {
	const encode = encoder({
		secret         : 'my-little-secret',
		expireInSeconds: 60 * 60 * 24 * 365 * 100,
		time           : () => 1499702179
	})
	const decode = decoder({
		secret: 'my-little-secret'
	})

	const token = encode({
		foo : 'bar',
		whiz: 'bang'
	})
	const {exp, foo, whiz} = decode( token )

	expect( exp ).toEqual( 4653302179 )
	expect( foo ).toEqual( 'bar' )
	expect( whiz ).toEqual( 'bang' )
})

test( 'jwt token encoded and decoded with different secret should catch an error', () => {
	const encode = encoder({
		secret         : 'my-dirty-little-secret',
		expireInSeconds: 60 * 60 * 24 * 365 * 100,
		time           : () => 1499702179
	})
	const decode = decoder({
		secret: 'my-little-secret'
	})

	const token = encode({
		foo : 'bar',
		whiz: 'bang'
	})

	try {
		decode( token )
	} catch ( e ) {
		expect( e ).toBeTruthy()
	}
})

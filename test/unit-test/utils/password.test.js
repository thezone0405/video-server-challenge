import {hash} from 'utils/password'

describe( 'hash', () => {
	it( 'creates a sha256 hash encoded as a hex string', () => {
		expect( hash( 'mark21' ) ).toBe(
			'254b16e053ca075967a176d91a151790aac1ee1b713b6e51598b8367d7901abe'
		)
		expect( hash( 'markbame' ) ).toBe(
			'c2b41b77e00c7aaf0f13f781ace14df6d0428d8636b95cdb32b080459a54480a'
		)
	})

	it( 'creates a salted sha256 hash encoded as a hex string', () => {
		expect( hash( 'mark', 'sea-salt' ) ).toBe(
			'0a134ee9ad38290ed8f4aad0a28a250cb71fdb854066b23edfe7f9c856736911'
		)
		expect( hash( 'markbame', 'table-salt' ) ).toBe(
			'f21ca46889fce9f28d8742a9226257eb058c7ed8dcb22e7897bc0f1da01b0564'
		)
	})
})
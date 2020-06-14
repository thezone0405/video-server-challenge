import {ConferenceRoomClass} from 'model/conferenceRoom'

const ROOM = {
  _id: "sampleroomid",
  name: "sample conference room",
  host: "sampleid",
  limit: 10,
  participants: [
    "sampleid",
    "sampleid2"
  ]
}

const mock = options => {
	class ConferenceRoom extends ConferenceRoomClass {
		static findOne ( opts ) {
			const result = new Promise( ( resolve ) => {
				resolve( options.findOne( opts ) )
			})
			result.exec = () => result
			return result
		}
		static create ( opts ) {
			const result = new Promise( ( resolve ) => {
				resolve( options.create( opts ) )
			})
			result.exec = () => result
			return result
		}
	}
	return ConferenceRoom
}

describe("Validate", () => {
  test("Returns the IDs if user is an existing participant of the room", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( ROOM )
    const result = await expect(
      mock({
        findOne
      }).validIDs("sampleid2", "sampleroomid")
    ).resolves.toMatchObject({userID: "sampleid2", roomID: "sampleroomid"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'sampleroomid' })
    return result
  })

  test("Rejects validation if user is not a participant", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( ROOM )
    const result = await expect(
      mock({
        findOne
      }).validIDs("sampleid5", "sampleroomid")
    ).rejects.toMatchObject({message: "user_not_participant"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'sampleroomid' })
    return result
  })

  test("Rejects validation if room does not exists", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( null )
    const result = await expect(
      mock({
        findOne
      }).validIDs("sampleid5", "sampleroomid")
    ).rejects.toMatchObject({message: "not_found"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'sampleroomid' })
    return result
  })
})

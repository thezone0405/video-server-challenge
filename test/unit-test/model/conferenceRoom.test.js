import {ConferenceRoomClass} from 'model/conferenceRoom'

const ROOM = {
  _id: "sampleroomid",
  name: "sample conference room",
  host: "sampleid",
  capacity: 10,
  participants: [
    "sampleid",
    "sampleid2"
  ]
}

const ROOM2 = {
  _id: "sampleroomid",
  name: "sample conference room",
  host: "sampleid",
  capacity: 4,
  participants: [
    "sampleid",
    "sampleid2",
    "sampleid3",
    "sampleid4"
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

describe("Validateb update", () => {
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

describe("Validate join", () => {
  test("Returns true if inputs are valid", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( ROOM )
    const result = await expect(
      mock({
        findOne
      }).validRoom("sampleid3", "sampleroomid")
    ).resolves.toBeTruthy()

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
      }).validRoom("sampleid5", "sampleroomid")
    ).rejects.toMatchObject({message: "not_found"})
    
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
      }).validRoom("sampleid5", "samplenonexistingroomid")
    ).rejects.toMatchObject({message: "not_found"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'samplenonexistingroomid' })
    return result
  })

  test("Rejects validation if room is full", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( ROOM2 )
    const result = await expect(
      mock({
        findOne
      }).validRoom("sampleid5", "sampleroomid")
    ).rejects.toMatchObject({message: "room_full"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'sampleroomid' })
    return result
  })

  test("Rejects validation if user is already in the room", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( ROOM2 )
    const result = await expect(
      mock({
        findOne
      }).validRoom("sampleid4", "sampleroomid")
    ).rejects.toMatchObject({message: "already_joined"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'sampleroomid' })
    return result
  })
})

describe("Validate leave", () => {
  test("Returns true if inputs are valid", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( ROOM )
    const result = await expect(
      mock({
        findOne
      }).validRoomLeave("sampleid2", "sampleroomid")
    ).resolves.toBeTruthy()
    
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
      }).validRoomLeave("sampleid2", "samplenonexistingroomid")
    ).rejects.toMatchObject({message: "not_found"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'samplenonexistingroomid' })
    return result
  })

  test("Rejects validation if user is not in the room", async () => {
    const findOne = jest.fn()
    findOne.mockReturnValueOnce( ROOM )
    const result = await expect(
      mock({
        findOne
      }).validRoomLeave("sampleid4", "sampleroomid")
    ).rejects.toMatchObject({message: "user_not_in_room"})
    
    expect( findOne.mock.calls.length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ].length ).toBe( 1 )
    expect( findOne.mock.calls[ 0 ][ 0 ] ).toEqual({ _id: 'sampleroomid' })
    return result
  })
})

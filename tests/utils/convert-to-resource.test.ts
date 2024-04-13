import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import ResourceConverter from '@sx/utils/convert-to-resource'


describe('ResourceConverter', () => {
  it('should return null if key is not in resourceMap', async () => {
    const converter = new ResourceConverter()
    const result = await converter.getResourceFromId('1', 'notInMap')
    expect(result).toBeNull()
  })

  it('should retrieve an instance using service', async () => {
    jest.spyOn(MembersService.prototype, 'get').mockResolvedValue({id: '1', name: 'test'} as object as Member)
    const converter = new ResourceConverter()
    const result = await converter.getResourceFromId('1', 'memberId')
    expect(result).toEqual({id: '1', name: 'test'})
  })
})

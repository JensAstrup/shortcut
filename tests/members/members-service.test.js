import MembersService from '../../src/members/members-service'


describe('MembersService', () => {
    it('should throw an error when attempting to create a new member', () => {
        const service = new MembersService({headers: {}})
        expect(service.create()).rejects.toThrow('The API does not support creating members')
    })
})

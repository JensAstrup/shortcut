import Member from '../../src/members/member'


describe('Member', () => {
    it('should construct a new member instance on instantiation', () => {
        const member = new Member({id: 'UUID1', name: 'Test Member'})
        expect(member.id).toBe('UUID1')
        expect(member.name).toBe('Test Member')
    })
})

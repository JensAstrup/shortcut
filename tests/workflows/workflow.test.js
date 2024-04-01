import Workflow from '../../src/workflows/workflow'


describe('Workflow', () => {
    it('should construct a new workflow instance on instantiation', () => {
        const workflow = new Workflow({id: 'UUID1', name: 'Test Workflow'})
        expect(workflow.id).toBe('UUID1')
        expect(workflow.name).toBe('Test Workflow')
    })
})

import KeyResult from '@sx/key-results/key-result'


describe('Key Result', () => {
  it('should create a key result', () => {
    const keyResultData = {name: 'Key Result 1', objectiveId: 1}
    const keyResult = new KeyResult(keyResultData)
    expect(keyResult.name).toBe('Key Result 1')
    expect(keyResult.objectiveId).toBe(1)
  })
})
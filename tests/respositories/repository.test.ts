import RepositoryInterface from '@sx/repositories/contracts/repository'
import Repository from '@sx/repositories/repository'


describe('Repository', () => {
  it('should instantiate a new Repository', () => {
    const repositoryData = {
      createdAt: new Date(),
      entityType: 'entityType',
      externalId: 'externalId',
      fullName: 'fullName',
      id: 1,
      name: 'name',
      type: 'type',
      updatedAt: new Date(),
      url: 'url'
    } as object as RepositoryInterface
    const repository = new Repository(repositoryData)
    expect(repository).toBeInstanceOf(Repository)
    expect(repository.createdAt).toEqual(repositoryData.createdAt)
    expect(repository.entityType).toEqual(repositoryData.entityType)
    expect(repository.externalId).toEqual(repositoryData.externalId)
    expect(repository.fullName).toEqual(repositoryData.fullName)
    expect(repository.id).toEqual(repositoryData.id)
    expect(repository.name).toEqual(repositoryData.name)
    expect(repository.type).toEqual(repositoryData.type)
    expect(repository.updatedAt).toEqual(repositoryData.updatedAt)
    expect(repository.url).toEqual(repositoryData.url)
  })
})

import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'


export default interface CreateLinkedFileData extends Omit<LinkedFileInterface, 'id' | 'createdAt' | 'updatedAt' | 'storyIds'> {
    storyId?: number
    uploaderId?: number
}

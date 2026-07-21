import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'


interface CreateLinkedFileData extends Omit<LinkedFileInterface, 'id' | 'createdAt' | 'updatedAt' | 'storyIds'> {
    storyId?: number
    uploaderId?: number
}

export { CreateLinkedFileData as default }


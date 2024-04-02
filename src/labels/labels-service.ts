import BaseService, {ServiceOperation} from '@sx/base-service'
import Label from '@sx/labels/label'
import LabelInterface from '@sx/labels/contracts/label-interface'


export default class LabelsService extends BaseService<Label, LabelInterface> {
    public static baseUrl: string = 'https://api.shortcut.com/api/v3/labels'
    protected factory = (data: object) => new Label(data)
    public availableOperations: ServiceOperation[] = ['get', 'list']
}

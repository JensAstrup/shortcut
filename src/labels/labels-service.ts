import BaseService, {ServiceOperation} from '@sx/base-service'
import LabelInterface from '@sx/labels/contracts/label-interface'
import Label from '@sx/labels/label'


export default class LabelsService extends BaseService<Label, LabelInterface> {
  public baseUrl: string = 'https://api.app.shortcut.com/api/v3/labels'
  protected factory = (data: object) => new Label(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']

  /**
   * A convenience method to get a label by its name
   * @param name - The name of the label to get. Note that the search is case-sensitive.
   * @returns The label with the given name, or null if no label is found
   */
  public async getByName(name: string): Promise<Label | null> {
    const labels = await this.list()
    return labels.find(label => label.name === name) || null
  }
}

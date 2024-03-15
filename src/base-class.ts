export default class ShortcutResource {
    private get workflows(): { [p: number]: { [p: string]: unknown } } {
        return this._workflows;
    }

    private set workflows(value: { [p: number]: { [p: string]: unknown } }) {
        this._workflows = value;
    }

    protected _workflows: {[key: number]: {[key: string]: unknown}} = {500_000_006: {name: 'In Development'}}

}

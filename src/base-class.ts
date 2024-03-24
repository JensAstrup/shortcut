export default class ShortcutResource<T = object> {
    [key: string]: unknown
    protected changedFields: string[] = []
    public static baseUrl = 'https://api.app.shortcut.com/api/v3'

    constructor(init?: T) {
        if (init) {
            Object.assign(this, init)
        }
        this.changedFields = []
        // Return a Proxy object to intercept property access and set operations on derived classes
        return new Proxy(this, {
            get(target, property, receiver) {
                return Reflect.get(target, property, receiver)
            },
            set(target, property, value, receiver) {
                // Track all changes made to the object
                if (!target.changedFields.includes(String(property))) {
                    target.changedFields.push(String(property))
                }
                return Reflect.set(target, property, value, receiver)
            }
        })
    }
}

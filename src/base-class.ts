export default class ShortcutResource<T = object> { // Default to an empty object type if no generic type is provided
    [key: string]: unknown // Keep the index signature to handle dynamic property access
    protected changedFields: string[] = []
    public static baseUrl = 'https://api.app.shortcut.com/api/v3'

    constructor(init?: T) {
        if (init) {
            Object.assign(this, init)
        }
        this.changedFields = []
        return new Proxy(this, {
            get(target, property, receiver) {
                console.log(`Property ${String(property)} accessed`)
                return Reflect.get(target, property, receiver)
            },
            set(target, property, value, receiver) {
                console.log(`Property ${String(property)} changed from ${Reflect.get(target, property, receiver)} to ${value}`)
                if (!target.changedFields.includes(String(property))) {
                    target.changedFields.push(String(property))
                }
                return Reflect.set(target, property, value, receiver)
            }
        });
    }
}

export default class ShortcutResource<T = {}> { // Default to an empty object type if no generic type is provided
    [key: string]: any // Keep the index signature to handle dynamic property access
    public changedFields: string[] = []
    public static baseUrl = 'https://api.app.shortcut.com/api/v3'

    constructor(init?: T) {
        if (init) {
            Object.assign(this, init)
        }
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

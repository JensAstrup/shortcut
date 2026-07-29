/** A class constructor, as used by the mixin factories in `base-resource.ts` and `base-service.ts`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T

export default Constructor

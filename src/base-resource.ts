import axios from 'axios'

import BaseInterface from '@sx/base-interface'
import camelToSnake from '@sx/utils/camel-to-snake'
import {getHeaders} from '@sx/utils/headers'
import snakeToCamel from '@sx/utils/snake-to-camel'


/* The possible operations that can be available on a resource */
export type ResourceOperation = 'update' | 'create' | 'delete' | 'comment'


/**
 * Base class for all Shortcut resources. Provides methods for creating, updating, and deleting resources.
 * @group Story
 */
export default abstract class ShortcutResource<Interface = BaseInterface> {
  [key: string]: unknown

  /**
   * @internal
   * Fields that have been changed, used to determine what to update. It is not recommended to access this property directly.
   */
  public changedFields: string[] = []
  /**
   *  Fields that are used when creating a new resource
   */
  public createFields: string[] = []
  /**
   * The available operations for the resource, any not in this list will raise an error when called
   */
  public availableOperations: ResourceOperation[] = []

  /**
   * Return a Proxy object to intercept property access and set operations on derived classes.
   * The Proxy object will track changes made to the object and store them in the `changedFields` property
   * to be used when updating the resource.
   * @param init - An object containing the initial values for the resource.
   */
  constructor(init?: Interface) {
    if (init) {
      Object.assign(this, init)
    }
    this.changedFields = []
    // Check to ensure that the baseUrl property is overridden in the subclass
    if (this.constructor === ShortcutResource) {
      (this.constructor as typeof ShortcutResource).baseUrl
    }
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

  static get baseUrl(): string {
    throw new Error('You must override baseUrl in the subclass')
  }

  /**
   * Update the current instance of the resource with the changed fields.
   * @return {Promise<void>} - A Promise that resolves when the resource has been updated.
   * @throws {Error} - Throws an error if the HTTP request fails.
   */
  public async update(): Promise<void> {
    if (!(this.availableOperations.includes('update'))) {
      throw new Error('Update operation not available for this resource')
    }
    const baseUrl = (this.constructor as typeof ShortcutResource).baseUrl
    const url = `${baseUrl}/${this.id}`
    const body = this.changedFields.reduce((acc: Record<string, unknown>, field) => {
      if (field.startsWith('_')) {
        return acc
      }
      acc[camelToSnake(field)] = this[field]
      return acc
    }, {})

    await axios.put(url, body, {headers: getHeaders()})
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error status', error.response.status)
          console.error('Error data', error.response.data)
          console.error('Error headers', error.response.headers)
          console.log('Request data', body)
          return
        }
        else if (error.request) {
          // The request was made but no response was received
          console.error('Error request', error.request)
          return
        }
        else {
          // Something happened in setting up the request that triggered an error
          console.error('Error message', error.message)
          return
        }
      }).then((response) => {
        if(!response) {
          return
        }
        const data: Record<string, unknown> = response!.data
        Object.keys(data).forEach(key => {
          this[snakeToCamel(key)] = data[key]
          this.changedFields = []
        })
      })
  }

  /**
   * Create a new instance of the resource, using the current object's properties. Use the `xCreateData` interface to determine which fields are available for creation.
   * @return {Promise<this>} - A Promise that resolves with the newly created instance.
   * @throws {Error} - Throws an error if the HTTP request fails.
   */
  public async create(): Promise<this> {
    if (!(this.availableOperations.includes('create'))) {
      throw new Error('Create operation not available for this resource')
    }
    const baseUrl = (this.constructor as typeof ShortcutResource).baseUrl
    const body: Record<string, unknown> = {}
    Object.keys(this).forEach(key => {
      if (this.createFields.includes(key)) {
        body[camelToSnake(key)] = this[key]
      }
    })

    const response = await axios.post(baseUrl, body, {headers: getHeaders()})
    if (response.status >= 400) {
      throw new Error('HTTP error ' + response.status)
    }

    return Object.assign(this, response.data)
  }

  /**
   * This method can be overridden by derived classes to perform any necessary operations before saving the resource
   * @protected
   */
  protected async _preSave(): Promise<void> {
  }

  /**
   * Save the current instance of the resource. If the resource already exists (has an ID), it will be updated.
   * Otherwise, it will be created using the fields `createFields`.
   */
  public async save(): Promise<void> {
    await this._preSave()
    if (this.id) {
      await this.update()
    }
    else {
      await this.create()
    }
  }

  /**
   * Delete the current instance of the resource.
   * @return {Promise<void>} - A Promise that resolves when the resource has been deleted.
   * @throws {Error} - Throws an error if the HTTP request fails.
   */
  public async delete(): Promise<void> {
    if (!(this.availableOperations.includes('delete'))) {
      throw new Error('Delete operation not available for this resource')
    }
    const url = `${this.baseUrl}/${this.id}`
    await axios.delete(url, {headers: getHeaders()}).catch((error) => {
      throw new Error(`Error deleting resource: ${error}`)
    })
  }
}

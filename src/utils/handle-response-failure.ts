import {AxiosError} from 'axios'


/**
 * Handle a failed response from an Axios request.
 * @param {AxiosError} error - The error object from the Axios request.
 * @param {Record<string, unknown>} body - The body of the request.
 */
export function handleResponseFailure(error: AxiosError, body: Record<string, unknown>) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error status', error.response.status)
    console.error('Error data', error.response.data)
    console.error('Error headers', error.response.headers)
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
}

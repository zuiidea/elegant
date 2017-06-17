import pathToRegexp from 'path-to-regexp'
import axios from 'axios'
import lodash from 'lodash'
import { prefix } from './config'

const fetch = (options) => {
  const { method = 'get', data = {} } = options
  let { url } = options

  const cloneData = lodash.cloneDeep(data)
  const headers = {}

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    console.log(e)
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request(options) {
  return fetch(options).then((response) => {
    const { statusText, status, data } = response
    return {
      data,
      success: true,
      statusCode: status,
      message: statusText,
    }
  })
  .catch((error) => {
    const { response } = error
    let message
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText, status } = response
      statusCode = status
      message = data.message || statusText
    } else {
      message = error.message || 'Network Error'
    }
    return { success: false, message, statusCode }
  })
}

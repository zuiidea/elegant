import { request, config } from 'utils'

const { APIV1 } = config

export async function query(params) {
  return request({
    url: `${APIV1}/platform/:platform/article/:id`,
    data: params,
  })
}


export async function list(params) {
  return request({
    url: `${APIV1}/article`,
    data: params,
  })
}

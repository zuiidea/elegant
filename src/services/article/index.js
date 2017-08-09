import { request, config } from 'utils'

const { APIV1 } = config

export async function query(params) {
  return request({
    url: `${APIV1}/:platform/articles/:id`,
    method: 'get',
    data: params,
  })
}

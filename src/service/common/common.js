import fetch from '@/utils/fetch'
import getPath from './path'
function homeRequest () {}
homeRequest.getListDataApi = (params) => {
  return fetch.get(getPath('v10Path'), {
    params: params
  })
}
homeRequest.getDetailDataApi = (params) => {
  return fetch.get(getPath('v10DetailPath'), {
    params: params
  })
}
homeRequest.getHitsDataApi = (params) => {
  return fetch.get(getPath('v10HitsPath'), {
    params: params
  })
}
homeRequest.getSearchDataApi = (params) => {
  return fetch.get(getPath('v10SearchPath'), {
    params: params
  })
}
homeRequest.getGBookDataApi = (params) => {
  return fetch.get(getPath('v10GetGBookDataPath'), {
    params: params
  })
}
homeRequest.GBookSaveDataApi = (params) => {
  return fetch.post(getPath('v10GBookSaveDataPath'), params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
homeRequest.getVerifyApi = getPath('v10VerifyPath')
export default homeRequest

import __CONG from '@/config'
const __Base = __CONG.API
const PATH = {
  v8Path: __Base + '/inc/apijson.php',
  v10Path: __Base + '/ajax/data',
  v10DetailPath: __Base + '/ajax/getDetail',
  v10HitsPath: __Base + '/ajax/hits',
  v10SearchPath: __Base + '/ajax/suggest',
  v10GetGBookDataPath: __Base + '/ajax/gbookView',
  v10GBookSaveDataPath: __Base + '/ajax/gbookSave',
  v10VerifyPath: __Base + '/verify'
}
function getPath (key) {
  return PATH[key]
}
export default getPath

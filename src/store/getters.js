/*
 * @Date: 2020-09-10 17:16:46
 * @Description:
 * @LastEditors: JWJ
 * @LastEditTime: 2021-02-01 14:05:32
 * @FilePath: \vue-music-admin\src\store\getters.js
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes
}
export default getters

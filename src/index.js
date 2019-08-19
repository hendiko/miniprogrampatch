/*
 * @Author: Xavier
 * @Date: 2018-10-20 12:56:52
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-08-19 10:50:05
 */
import { patchPage } from "./Page";
import { patchComponent } from "./Component";
import { patchOnShareAppMessage, patchRouterPage } from "./onShareAppMessage";

module.exports = {
  patchComponent,
  patchOnShareAppMessage,
  patchPage,
  patchRouterPage
};

/*
 * @Author: Xavier Yin
 * @Date: 2019-08-19 10:41:08
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-08-19 14:15:15
 *
 * 为小程序提供分享消息落地页重定向能力。
 * （先打开中转页面，一般是首页，然后重定向到落地页。如此页面标题栏可点击后退按钮返回到中转页）
 */

const qstringify = (url, queries) => {
  let qs = [];
  if (queries) {
    for (let q in queries) {
      qs.push(`${q}=${queries[q]}`);
    }
  }
  return qs.length ? `${url}?${qs.join("&")}` : url;
};

const rePath = /(^[^?]*)/;
const getPath = url => {
  let result = rePath.exec(url);
  return result ? result[1] : "";
};

function isEqualPath(p1, p2) {
  return p1.replace(/^\//g, "") === p2.replace(/^\//g, "");
}

/**
 * 为 onShareAppMessage 打补丁
 * @param {object} Page 小程序页面构造函数 Page
 * @param {object} options 可选项
 */
function patchOnShareAppMessage(Page, options) {
  if (Page.__patchOnShareAppMessage) return Page;

  // router 表示中转页路径
  let { router } = options || {};

  let constructor = function(obj) {
    obj = Object.assign({}, obj);

    let { onShareAppMessage } = obj;

    if ("function" === typeof onShareAppMessage) {
      obj.onShareAppMessage = function(opts) {
        let result = onShareAppMessage.call(this, opts);
        let { path, router: _router = router } = result || {};
        if (_router) {
          if (!path) path = qstringify(this.route, this.options);
          let route = getPath(path);
          // 如果分享页和中转页是同一个页面，则无需中转
          if (isEqualPath(_router, route)) {
            return result;
          } else {
            path = `${_router}${
              ~_router.indexOf("?") ? "&" : "?"
            }redirectTo=${encodeURIComponent(path)}`;
            return Object.assign({}, result, { path });
          }
        } else {
          return result;
        }
      };
    }

    return Page(obj);
  };

  constructor.__patchOnShareAppMessage = true;
  return constructor;
}

/**
 * 解析中转页的 redirectTo 参数，完成页面重定向。
 */
function patchRouterPage(Page) {
  if (Page.__patchRouterPage) return Page;

  let constructor = function(obj) {
    obj = Object.assign({}, obj);
    let { onLoad } = obj;

    obj.onLoad = function(options) {
      let { redirectTo } = options;
      if (redirectTo) {
        let url = decodeURIComponent(redirectTo);
        if (!url.startsWith("/")) url = "/" + url;
        wx.navigateTo({
          url,
          fail() {
            wx.switchTab({ url: getPath(url) });
          }
        });
      }

      if ("function" === typeof onLoad) {
        onLoad.call(this, options);
      }
    };

    return Page(obj);
  };

  constructor.__patchRouterPage = true;
  return constructor;
}

export { patchOnShareAppMessage, patchRouterPage };

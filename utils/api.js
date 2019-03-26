const API_PREFIX = "https://api.jijigugu.club"

function get(uri, data, header) {
  return request("GET", uri, data, header)
}

function post(uri, data, header) {
  return request("POST", uri, data, header)
}

function request(method, uri, data, header) {
  const url = API_PREFIX + uri
  return new Promise((resolve, reject) => {
    wx.request({
      url, data, header, method,
      success(data) {
        data = data.data
        if (data.code != 0) {
          return console.log(data)
        }
        resolve(data.data)
      },
      fail(err) {
        console.log(err)
      }
    })
  })
}

module.exports = {get, post}
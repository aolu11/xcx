const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function moods2View(moods, col) {
  const views = JSON.parse(JSON.stringify(moods))
  for (let i = 0; i < views.length; i++) {
    const view = views[i];
    const newList = [];
    for (let j = 0; j < view.list.length; j++) {
      const dim1 = Math.floor(j / col);
      const dim2 = j % col;
      if (newList.length < dim1 + 1) {
        newList[dim1] = [];
      }
      newList[dim1][dim2] = view.list[j]
    }
    view.list = newList
  }
  return views
}

function getUpdateArrayData(dataKey, arr, startIndexs) {
  const data = {}
  for (const item of arr) {
    data[dataKey + "[" + startIndexs++ + "]"] = item
  }
  return data
}


module.exports = {
  formatTime: formatTime,
  moods2View,
  getUpdateArrayData
}

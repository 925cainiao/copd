// 年龄
exports.dealAge = function (val) {
  if (val) {
    let date = new Date()
    let year = date.getFullYear()
    return Number(year) - Number(val)
  } else {
    return val
  }
}
// 性别
exports.dealGender = function (val) {
  var gender = ''
  switch (val) {
    case 1:
      gender = '男'
      break
    case 2:
      gender = '女'
      break
    case 9:
      gender = '其他'
      break
    default:
      gender = ''
  }
  return gender
}

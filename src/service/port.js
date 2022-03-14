// import Vue from 'vue'

import axios from 'axios'
// let v = new Vue()
// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response)
    //   if (response.data.ret) {
    //     if (response.data.ret === 403 && response.data.msg.indexOf('超时') > -1) {
    //       router.replace({
    //         path: '/'
    //       })
    //     }
    //   }
    return response
  },
  error => {
    console.log(error.response)
    // if (error.response) {
    //   switch (error.response.status) {
    //     case 403:
    //       // 跳转到登录页面
    //       router.replace({
    //         path: '/'
    //       })
    //   }
    // }
    // 返回接口返回的错误信息
    // return Promise.reject(error.response.data)
    // v.$message.error(error)
    return Promise.reject(error)
  })
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params
    ).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
export function put (url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params
    ).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
export function $delete (url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

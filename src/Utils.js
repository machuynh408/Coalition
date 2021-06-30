import loader from 'load-script'

export function loadSDK (url, sdkGlobal) {
  return new Promise((resolve, reject) => {
    let executor =  {resolve, reject}
    loader(url, err => {
        if (err) {
            console.log(err)
            executor.reject(window[sdkGlobal])
            return
        }
        executor.resolve(window[sdkGlobal])
    })
  })
}
import loader from 'load-script'
import moment from 'moment';

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

export function totalSecondsToStr (totalSeconds) {
  return isoToStr(moment.duration(totalSeconds, 'seconds').toISOString())
}

export function isoToStr (time) {
  var source = moment.duration(time)
  var hasHours = source.hours() > 0
  const hours = source.hours()
  const minutes = source.minutes()
  const seconds = source.seconds()
  return `${hasHours ? hours + ':' : ''}${hasHours && minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

export function getTotalSeconds (time) {
  var source = moment.duration(time)
  return source.asSeconds()
}
import React from 'react'
import { loadSDK } from './Utils'
 
const SDK_URL = 'https://www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'

export default class YouTube extends React.Component {
    
    state = {
        isReady: false,
        lastTimeUpdate: 0,
    }

    componentDidMount = () => {
        if (!window.YT || !this.state.isReady) {
            loadSDK(SDK_URL, SDK_GLOBAL).then(_ => {
                window.onYouTubePlayerAPIReady = this.load.bind(this)
                this.setState({ isReady: true })
            }).catch(err => {
                console.log("YouTube API Failed!")
            })
        }
    }

    load = () => {
        console.log("YouTube API Success!")
        this.player = new window.YT.Player('player', {
            height: '0',
            width: '0',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onStateChange': (event) => this.props.stateChanged(event.data)
            }
        })

        window.addEventListener('message', (event) => {
            if (event.source === this.player.getIframe().contentWindow) {
                var data = JSON.parse(event.data);
          
                if (data.event === "infoDelivery" && data.info && data.info.currentTime) {
                  var time = Math.floor(data.info.currentTime);
          
                  if (time !== this.state.lastTimeUpdate) {
                      this.setState({ lastTimeUpdate: time })
                      this.props.onElapsed(time)
                  }
                }
            }
        })
    }

    play = () => this.player.playVideo()

    playById = (videoId, start = 0) => this.player.loadVideoById(videoId, start)

    pause = () => this.player.pauseVideo()

    setVolume = (value) => this.player.setVolume(value)

    render() {
        return (<div id={'player'} />)
    }
}
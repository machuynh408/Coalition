import React from 'react'
import { loadSDK } from './Utils'
 
const SDK_URL = 'https://www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'

export default class YouTube extends React.Component {
    
    state = { 
        playerState: -1,
        isReady: false
    }

    componentDidMount = () => {
        if (!window.YT || !this.state.isReady) {
            loadSDK(SDK_URL, SDK_GLOBAL).then(_ => {
                window.onYouTubePlayerAPIReady = this.load.bind(this)
                this.setState({ isReady: true })
            }).catch(err => {
                console.log(err)
            })
        }
    }

    load = () => {
        this.player = new window.YT.Player('player', {
            height: '0',
            width: '0',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onStateChange': this.onPlayerStateChange
            }
        })
    }

    onPlayerStateChange = (event) => this.setState({playerState: event.data})

    play = () => this.player.playVideo()

    play = (videoId, start = 0) => {
        this.player.loadVideoById(videoId, start)
    }

    pause = () => this.player.pauseVideo()

    setVolume = (value) => {
        this.player.setVolume(value)
    }

    render() {
        return (<div id={'player'} />)
    }
}
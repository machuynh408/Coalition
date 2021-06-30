import React from 'react'
import { loadSDK } from './Utils'
 
const SDK_URL = 'https://www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'

export default class YouTube extends React.Component {

    constructor(props) {
        super(props)
        this.state = { playerState: -1 }
    }

    componentDidMount = () => {
        if (!window.YT) {
            loadSDK(SDK_URL, SDK_GLOBAL).then(_ => {
                window.onYouTubePlayerAPIReady = this.load.bind(this)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    load = () => {
        this.player = new window.YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onStateChange': this.onPlayerStateChange
            }
        })
    }

    onPlayerStateChange = (event) => this.setState({playerState: event.data})

    play = () => this.player.playVideo()

    pause = () => this.player.pauseVideo()

    render() {
        return (<div id={'player'} />)
    }
}
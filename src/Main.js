import React, { Component } from 'react'
import YouTube from './YouTube'

export default class Main extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            operation: "Play"
        }
    }

    playerRef = player => this.player = player
    searchBarRef = searchBar => this.searchBar = searchBar

    operate = () => {
        switch(this.player.state.playerState) {
            case 1: // playing
                this.player.pause()
                this.setState({operation: "Play"})
                break
            case -1: // unstarted
            case 2: // paused
                this.player.play()
                this.setState({operation: "Pause"})
                break
        }
    }

    render() {
        return (
            <div>
                <YouTube ref={this.playerRef}/>
                <button onClick={this.operate.bind(this)}>{this.state.operation}</button>
            </div>
        );
    }
}
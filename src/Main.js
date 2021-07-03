import React, { Component } from 'react'
import YouTube from './YouTube'
import SearchBar from './SearchBar'

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
            default:
                break
        }
    }

    render() {
        return (
            <div>
                <SearchBar />
                <YouTube ref={this.playerRef}/>
                <button onClick={this.operate.bind(this)}>{this.state.operation}</button>
            </div>
        );
    }
}
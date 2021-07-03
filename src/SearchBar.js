import React from 'react'
import Axios from 'axios'

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search"
const YOUTUBE_API_KEY = ""

const SOUNDCLOUD_API = "SC"
const SOUNDCLOUD_API_KEY = ""

const SPOTIFY_API = "SPOT"
const SPOTIFY_API_KEY = ""

export default class SearchBar extends React.Component {

    state = {
        searchValue: "",
        searchType: 0,
        searchResults: [],
        queue: []
    }

    search() {

        const source = document.getElementById("sources").value

        switch(source) {
            case 1:
                Axios({
                    "method": "GET",
                    "url": YOUTUBE_API,
                    "params": {
                        "part": "snippet",
                        "maxResults": "5",
                        "key": YOUTUBE_API_KEY,
                        "q": this.state.searchValue
                    }
                })
                .then((res) => {
                    var results = []
        
                    res.data.items.map((entry) => {
                        results.push({
                            "videoId": entry.id.videoId,
                            "title": entry.snippet.title,
                            "channel": entry.snippet.channelTitle,
                            "thumbnail": "https://i.ytimg.com/vi/" + entry.id.videoId + "/mqdefault.jpg", //default.jpg // 120 90 //mqdefault.jpg // 320 180  //hqdefault.jpg // 480 360
                            "source": "youtube"
                            })
                    })
        
                    this.setState({searchResults: results})
        
                })
                .catch((error) => {
                    console.log(error)
                })
                break
        }
    }

    render() {
        return (
            <div>
                <input type="text" placeholder="Music" value= { this.state.searchValue } onChange= { (e) => this.setState({ searchValue: e.target.value }) }></input>

                <select id="sources">
                    <option value="0" selected>All</option>
                    <option value="1">YouTube</option>
                    <option value="2">SoundCloud</option>
                    <option value="3">Spotify</option>
                </select>

                <button onClick= {this.search.bind(this)}>Search</button>
                <ul>
                    {this.state.searchResults.map((entry) => (
                        <div key={entry["videoId"]}>
                            <div style={{ display: "inline-block" }}>
                                <img src={entry["thumbnail"]}></img>
                            </div>
                            <div style={{ display: "inline-block" }}>
                                <h2>{ entry["title"] }</h2>
                                <h3>{ entry["channel"] }</h3>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
        )
    }
}
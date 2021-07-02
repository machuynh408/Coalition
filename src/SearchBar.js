import React from 'react'
import Axios from 'axios'

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search"
const YOUTUBE_API_KEY = ""

export default class SearchBar extends React.Component {

    state = {
        searchValue: "",
        searchType: 0,
        searchResults: []
    }

    search() {
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
                    "thumbnail": "https://i.ytimg.com/vi/" + entry.id.videoId + "/mqdefault.jpg" //default.jpg // 120 90 //mqdefault.jpg // 320 180  //hqdefault.jpg // 480 360
                    })
            })

            this.setState({searchResults: results})

        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <div>
                <input type="text" placeholder="Music" value= { this.state.searchValue } onChange= { (e) => this.setState({ searchValue: e.target.value }) }></input>
                <button onClick= {this.search.bind(this)}>Search</button>
                <ul>
                    {this.state.searchResults.map((entry) => (
                        <div>
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
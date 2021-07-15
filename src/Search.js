import React from 'react'
import SearchInput from './UI/SearchInput';
import Axios from 'axios'
import { spotify } from './Spotify'
import { isoToStr, getTotalSeconds, totalSecondsToStr } from './Utils';
import { htmlUnescape } from 'escape-goat';


// Material-UI
import { Button, Grid } from '@material-ui/core';

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/"
const YOUTUBE_API_KEY = ""

export default class SearchBar extends React.Component {
    
    state = {
        searchValue: "",
        selectValue: 1
    }

    searchValueCallback = (value, perform) => {
        this.setState({ searchValue: value })
        if (perform) {
            this.search()
        }
    }

    selectValueCallback = (value) => {
        this.setState({ selectValue: value })
    }

    search() {
        var results = {}
        var requests = []
        switch(this.state.selectValue) {
            case 1: // YOUTUBE
                Axios({
                    "method": "GET",
                    "url": YOUTUBE_API + 'search',
                    "params": {
                        "part": "snippet",
                        "maxResults": "10",
                        "key": YOUTUBE_API_KEY,
                        "q": this.state.searchValue
                    }
                })
                .then((res) => {
                    res.data.items.map((entry) => {
                        if (entry.id.videoId !== undefined) {
                            results[entry.id.videoId] =
                            {
                                "id": entry.id.videoId,
                                "title":  htmlUnescape(entry.snippet.title),
                                "source": htmlUnescape(entry.snippet.channelTitle),
                                "durationStr": "",
                                "durationInt": 0,
                                "thumbnail": "https://i.ytimg.com/vi/" + entry.id.videoId + "/hqdefault.jpg", //default.jpg // 120 90 //mqdefault.jpg // 320 180  //hqdefault.jpg // 480 360
                                "variant": "youtube"
                            }
                        }
                    })
                })
                .then (() => {
                    for (var id in results) {
                        requests.push(
                            Axios.get(YOUTUBE_API + 'videos', {
                                "params": {
                                    "id": id,
                                    "part": "contentDetails",
                                    "key": YOUTUBE_API_KEY
                                }
                            })
                        )
                    }
                })
                .then (() => {
                    Promise.all(requests).then((res) => {
                        res.forEach((entry) => {
                            const id = entry["data"]["items"][0]["id"]
                            const time = entry["data"]["items"][0]["contentDetails"]["duration"]
                            results[id]["durationStr"] = isoToStr(time)
                            results[id]["durationInt"] = getTotalSeconds(time)
                        })
                        this.props.searchResultsChanged(Object.values(results))
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
                break
            case 2: // SPOTIFY  
                results = []     
                spotify.searchTracks(this.state.searchValue)
                .then((res) => {
                    const tracks = res.body["tracks"]["items"]

                    tracks.map((entry) => {
                        var source = ""
                        const artists = entry["artists"]
                        artists.map(artist => { source = source.concat(`${artist["name"]}, `)})
                        source = source.slice(0, source.length - 2)

                        const duration = entry["duration_ms"] / 1000

                        results.push({
                            "id":  entry["uri"],
                            "title": entry["name"],
                            "source": source,
                            "durationStr": totalSecondsToStr(duration),
                            "durationInt": duration,
                            "thumbnail": entry["album"]["images"][0]["url"],
                            "variant": "spotify"
                        })
                        this.props.searchResultsChanged(results)
                    })
                }, (err) => {
                    console.log(err)
                })
                break
            default:
                break
        }
    }

    render() {
        return (
            <>
                  <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                          <SearchInput textChanged={ (s, b) => this.searchValueCallback(s,b) } selectChanged= { this.selectValueCallback }/>
                      </Grid>
                      <Grid item>               
                          <Button variant="contained" color="primary" onClick={this.search.bind(this)}>Search</Button>
                      </Grid>
                      
                  </Grid>
            </>
        )
    }
}
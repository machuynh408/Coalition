import React from 'react'
import SearchInput from './UI/SearchInput';
import Axios from 'axios'
import { spotify } from './Spotify'
import { isoToStr, getTotalSeconds } from './Utils';

// Material-UI
import { Button, Grid } from '@material-ui/core';

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/"
const YOUTUBE_API_KEY = ""

export default class SearchBar extends React.Component {
    
    state = {
        searchValue: "",
        selectValue: 1
    }

    searchValueCallback = (value) => {
        this.setState({ searchValue: value })
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
                        "maxResults": "5",
                        "key": YOUTUBE_API_KEY,
                        "q": this.state.searchValue
                    }
                })
                .then((res) => {
                    res.data.items.map((entry) => {
                        if (entry.id.videoId !== undefined) {
                            results[entry.id.videoId] =
                            {
                                "videoId": entry.id.videoId,
                                "title": entry.snippet.title,
                                "channel": entry.snippet.channelTitle,
                                "durationStr": "",
                                "durationInt": 0,
                                "thumbnail": "https://i.ytimg.com/vi/" + entry.id.videoId + "/hqdefault.jpg", //default.jpg // 120 90 //mqdefault.jpg // 320 180  //hqdefault.jpg // 480 360
                                "source": "youtube"
                            }
                        }
                    })
                })
                .then (() => {
                    for (var videoId in results) {
                        requests.push(
                            Axios.get(YOUTUBE_API + 'videos', {
                                "params": {
                                    "id": videoId,
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
                            const videoId = entry["data"]["items"][0]["id"]
                            const time = entry["data"]["items"][0]["contentDetails"]["duration"]
                            results[videoId]["durationStr"] = isoToStr(time)
                            results[videoId]["durationInt"] = getTotalSeconds(time)
                        })
                    })
                    this.props.searchResultsChanged(Object.values(results))
                })
                .catch((error) => {
                    console.log(error)
                })
                break
            case 2: // SPOTIFY       
                spotify.searchTracks(this.state.searchValue)
                .then((res) => {
                    console.log(res.body)
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
                          <SearchInput textChanged={ this.searchValueCallback } selectChanged= { this.selectValueCallback }/>
                      </Grid>
                      <Grid item>               
                          <Button variant="contained" color="primary" onClick={this.search.bind(this)}>Search</Button>
                      </Grid>
                      
                  </Grid>
            </>
        )
    }
}
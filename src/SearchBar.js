import React from 'react'
import SearchInput from './UI/SearchInput';
import Axios from 'axios'
import { spotify } from './Spotify'

// Material-UI
import { Button, Grid } from '@material-ui/core';

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search"
const YOUTUBE_API_KEY = ""

export default class SearchBar extends React.Component {
    
    state = {
        searchValue: "",
        selectValue: 0
    }

    searchValueCallback = (value) => {
        this.setState({ searchValue: value })
    }

    selectValueCallback = (value) => {
        this.setState({ selectValue: value })
    }

    search() {

        switch(this.state.selectValue) {
            case 1: // YOUTUBE
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
                        console.log(entry)
                        results.push({
                            "videoId": entry.id.videoId,
                            "title": entry.snippet.title,
                            "channel": entry.snippet.channelTitle,
                            "thumbnail": "https://i.ytimg.com/vi/" + entry.id.videoId + "/hqdefault.jpg", //default.jpg // 120 90 //mqdefault.jpg // 320 180  //hqdefault.jpg // 480 360
                            "source": "youtube"
                            })
                    })
                    this.props.searchResultsChanged(results)
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
import './App.css';
import React from 'react'
import Search from './Search';
import Queue from './Queue'
import YouTube from './YouTube'
import Spotify, { SPOTIFY_ACCESS_URL } from './Spotify'
import { totalSecondsToStr } from './Utils';

// Material-UI
import { Typography, AppBar, Avatar, Badge, Button, CssBaseline, Divider, Grid, IconButton, List, ListItem, ListItemText, Slider, Toolbar, withStyles } from '@material-ui/core';
import { primaryBlack, primaryBlue } from './Colors';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { 
    PlayArrow, PlaylistAdd, 
    SkipPrevious, PlayCircleOutline, PauseCircleOutline, SkipNext, Repeat,
    QueueMusic, VolumeOff, VolumeUp, CheckBox, IndeterminateCheckBox
} from '@material-ui/icons';

const useStyles = (theme) => ({
    appBar: {
        backgroundColor: "#222222",
        maxHeight: 70,
    },
    mediaBar: {
        top: 'auto',
        bottom: 0,
        backgroundColor: "#222222",
        minHeight: 100,
        maxHeight: 125,
    },
    mediaMainButton: {
        height: 50,
        width: 50
    },
    mediaSlider: {
        width: 600,
        paddingTop: 5
    },
    volumeSlider: {
        color: 'red',
        width: 100,
        paddingTop: 5
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    }
});

const darkTheme = createMuiTheme({
    palette: {
      background: {
        default: primaryBlack
      },
      text: {
        primary: "#ffffff",
        secondary: '#bdbdbd'
      }
    }
  });

class App extends React.Component {

    state = {
        searchResults: [],
        volume: 50,
        playerState: -1,
        mediaState: -1,
        selectionIndex: -1,
        currentSeconds: 0,
        totalSeconds: 0,
        currentMedia: null,
        isRepeat: false
    }

    playerRef = (player) => this.player = player
    queueRef = (queue) => this.queue = queue

    componentDidMount = () => {
        const src = window.location.hash.split("&")
        const x = src[0]
        if (!x.startsWith("#access_token")) {
            return
        }
        var token = x.split("=")[1]
        localStorage.setItem("spotify_access_token", token)
    }

    searchResultsCallback = (value) =>  this.setState({ searchResults: value, selectionIndex: value.length > 0 ? 0 : -1 })

    stateChangedCallback = (value) =>  {
        console.log("stateChangedCallback: " + value)
        this.setState({ playerState: value })
        switch(value) {
            case 1: // playing
                this.setState({mediaState: 1})
                break
            case -1: // unstarted
            case 0: // ended
            case 2: // paused
            case 3: // buffering
                this.setState({mediaState: -1})
                if (value === 0) {
                    if (this.state.isRepeat) {
                        this.player.play()
                    }
                    else {
                        this.queue.next()
                    }
                }
                break
            default:
                break
        }
    }

    setVolume = (event, newValue) => {
        if (this.state.volume === newValue) {
            return
        }
        this.setState({ volume: newValue }, () => {
            if (!this.player.state.isReady) {
                return
            }
            this.player.setVolume(newValue)
        })
    }

    setSeconds = (event, newValue) => {
        if (this.state.currentSeconds === newValue) {
            return
        }
        if (!this.player.state.isReady) {
            return
        }
        console.log("commit: " + newValue)
        this.player.seek(newValue)
    }

    onSearchPlay = (index) => {
        const entry = this.state.searchResults[index]
        const id = entry["id"]
        const totalSeconds = entry["durationInt"]
        this.setState({ currentSeconds: 0, totalSeconds: totalSeconds, currentMedia: entry })
        this.play(id)
    }

    queueChangedCallback = (media) => {
        if (media === null) {
            return
        }
        this.setState({ currentMedia: media })
        const id = media["id"]
        const totalSeconds = media["durationInt"]
        this.setState({ currentSeconds: 0, totalSeconds: totalSeconds })
        this.play(id)
    }

    play = (videoId) => {
        try {
            this.player.setVolume(this.state.volume)
            this.player.playById(videoId)
            this.player.play()
        } 
        catch (err) {
            console.log(err)
        }
    }

    onSearchAdd = (index) => {
        const media = this.state.searchResults[index]
        this.queue.add(media)
    }

    elapsedCallback = (time) => this.setState({ currentSeconds: time })

    MainContent = () => {
        const classes = this.props
        return (
            <>
                <div style={{ marginTop: '5%', marginBottom: '8%' }}>
                    <List dense={false}>
                    { 
                        this.state.searchResults.map((entry, index) => {
                            return (
                                <>
                                    <ListItem key={index}
                                        style={{ backgroundColor: this.state.selectionIndex === index ? primaryBlue : '#424242'}} 
                                        onClick={ () => this.setState({selectionIndex: index})}>

                                        <Grid container direction="row">
                                            <Grid item container alignItems="center" spacing={1} xs={11}>
                                                <Grid item>
                                                    <div style={{ backgroundColor: entry["variant"] === 'youtube' ? 'red' : '#00e676', width: '5px', height: '50px'}}/>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar src={entry["thumbnail"]} className={classes.avatar} variant="rounded"/>
                                                </Grid>
                                                <Grid item>
                                                    <ListItemText
                                                        primary={entry["title"]}
                                                        secondary={entry["source"]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        
                                            <Grid item container direction="row-reverse" alignItems="center" justify="flex-start" xs={1}>
                                                <Grid item>
                                                    <IconButton color="inherit" onClick={ () => this.onSearchAdd(index) }>
                                                        <PlaylistAdd />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton color="inherit" onClick={ () => this.onSearchPlay(index) }>
                                                        <PlayArrow />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>                              
                                                    <Typography variant="subtitle1">{ entry["durationStr"] }</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    </ListItem>
                                    <Divider light />
                                </>
                            )
                        }) 
                    }           
                </List>
                </div>
            </>
       ) 
    }

    onMediaMainButton = () => {
        switch(this.state.mediaState) {
            case -1: // Play
                if (this.state.currentMedia === null && !this.state.isRepeat) {
                    this.queue.next()
                    return
                }
                this.player.setVolume(this.state.volume)
                this.player.play()
                break
            case 1: // Pause
                this.player.pause()
                break
            default:
                break
        }
    }

    MediaPlayer = () => {
        const { classes } = this.props
        return (

            <>
                <Grid container alignItems="center">

                    <Grid item container alignItems="center" xs={2}>
                        <Grid item xs={3}>
                            <div style={{ paddingLeft: '10px'}}>
                                <Avatar src={this.state.currentMedia !== null ? this.state.currentMedia["thumbnail"] : ''} 
                                    className={classes.avatar} 
                                    variant="rounded"/>
                            </div>
                        </Grid>
                        <Grid item container direction="column" xs={9}>
                            <Grid item>
                                <Typography noWrap="true" variant="subtitle1">{this.state.currentMedia !== null ? this.state.currentMedia["title"] : 'Title'}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography noWrap="true" variant="caption">{this.state.currentMedia !== null ? this.state.currentMedia["source"] : 'Artist'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item container direction="column" alignItems="center" justify="center" xs={8}>
                        <Grid item>
                            <Toolbar>
                                <IconButton color="inherit" onClick={ () => this.queue.prev() }>
                                    <SkipPrevious />
                                </IconButton>
                                <IconButton color="inherit" onClick={ () => this.onMediaMainButton() }>
                                    { this.state.mediaState === -1 ? <PlayCircleOutline className={classes.mediaMainButton}/> : <PauseCircleOutline className={classes.mediaMainButton}/> }
                                </IconButton>
                                <IconButton color="inherit" onClick={ () => this.queue.next() }>
                                    <SkipNext />
                                </IconButton>
                                <IconButton color="inherit" 
                                    style={{ color: this.state.isRepeat ? primaryBlue : 'white'}}
                                    onClick={ () => this.setState( { isRepeat: !this.state.isRepeat })}>
                                    <Repeat />
                                </IconButton>
                            </Toolbar>
                        </Grid>

                        <Grid item container spacing={2} justify="center" alignItems="center">
                            <Grid item>
                                <Typography variant="subtitle1">{totalSecondsToStr(this.state.currentSeconds)}</Typography>
                            </Grid>
                            <Grid item>
                                <div className={classes.mediaSlider}>
                                    <Slider value={this.state.currentSeconds} max={this.state.totalSeconds} step={1} 
                                        onChange={ (e, val) => this.setState({ currentSeconds: val }) }
                                        onChangeCommitted={ (e, val) => this.setSeconds(e, val) }
                                        />
                                </div>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1">{ totalSecondsToStr(this.state.totalSeconds) }</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item container spacing={1} justify="center" alignItems="center" xs={2}>
                        <Grid item>
                            <IconButton color="inherit">
                                <Badge badgeContent={this.queue.state.length} color="primary">
                                    <QueueMusic onClick={ () => this.queue.setVisibility(!this.queue.state.visible) }/>
                                </Badge>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="inherit">
                                { this.state.volume === 0 ? <VolumeOff /> : <VolumeUp /> }
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <div className={classes.volumeSlider}>
                                <Slider value={ this.state.volume } step={1} onChange={ (e, val) => this.setVolume(e, val) }/>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        )
    }

    render() {
        const { classes } = this.props

        return (
            <MuiThemeProvider theme={darkTheme}>
                <CssBaseline />
                <main>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar position="static">
                        <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={1}>
                                <Typography variant="h6">COALITION</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Search searchResultsChanged={ this.searchResultsCallback }/>
                            </Grid>
                            <Grid item container xs={2} justify="flex-end" spacing={1}>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="contained" 
                                        style={{ backgroundColor: 'red', color: 'white' }}
                                        startIcon={<IndeterminateCheckBox />}
                                        onClick={ () => console.log("hello") }>YouTube</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="contained" 
                                        style={{ backgroundColor: '#00e676', color: 'white' }}
                                        startIcon={localStorage.getItem("spotify_access_token") !== null ? <CheckBox /> : <IndeterminateCheckBox />}
                                        href={ SPOTIFY_ACCESS_URL }>Spotify</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                { this.MainContent() }
                <Queue ref={this.queueRef} onQueueChanged={this.queueChangedCallback}/>
                <Spotify />
                <YouTube ref={this.playerRef} stateChanged={this.stateChangedCallback} onElapsed={this.elapsedCallback}/>
                <AppBar position="fixed" color="primary" className={classes.mediaBar}>
                    { this.MediaPlayer() }
                </AppBar>
                </main>
                
            </MuiThemeProvider>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(App);

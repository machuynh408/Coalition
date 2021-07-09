import './App.css';
import React from 'react'
import SearchBar from './SearchBar';
import YouTube from './YouTube'
import { totalSecondsToStr } from './Utils';

// Material-UI
import { Typography, AppBar, Avatar, CssBaseline, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Slider, Toolbar, withStyles } from '@material-ui/core';
import { primaryBlack } from './Colors';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import YouTubeIcon from '@material-ui/icons/YouTube';
import { 
    PlayArrow, PlaylistAdd, 
    SkipPrevious, PlayCircleOutline, PauseCircleOutline, SkipNext, Repeat,
    QueueMusic, VolumeOff, VolumeUp, Pause
} from '@material-ui/icons';

const useStyles = (theme) => ({
    app: {
        backgroundColor: 'red'
    },
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
        width: 100,
        paddingTop: 5
    },
    card: {
        backgroundColor: theme.palette.background.paper
    },
    media: {
        height: 200,
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    typography: {
        display: 'inline-block'
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
        totalSeconds: 0
    }

    playerRef = (player) => this.player = player

    searchResultsCallback = (value) => {
        this.setState({ searchResults: value, selectionIndex: value.length > 0 ? 0 : -1 })
    }

    stateChangedCallback = (value) =>  {
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
                break
            default:
                break
        }
    }

    setVolume = (event, newValue) => {
        if (this.state.volume === newValue) {
            return
        }
        this.setState({ volume: newValue })
        if (!this.player.state.isReady) {
            return
        }
        this.player.setVolume(newValue)
    }

    setSeconds = (event, newValue) => {
        if (this.state.currentSeconds === newValue || !this.player.state.isReady) {
            return
        }
        this.setState({ currentSeconds: newValue })
    }

    onSearchPlay = (index) => {
        const videoId = this.state.searchResults[index]["videoId"]
        const totalSeconds = this.state.searchResults[index]["durationInt"]
        this.setState({ currentSeconds: 0, totalSeconds: totalSeconds })
        this.player.setVolume(this.state.volume)
        this.player.playById(videoId)
    }

    elapsedCallback = (time) => this.setState({ currentSeconds: time })

    MainContent = () => {
        const classes = this.props
        return (
            <>
                <List dense={false}>
                { 
                    this.state.searchResults.map((entry, index) => {
                        return (
                            <>
                                <ListItem key={index}
                                    style={{ backgroundColor: this.state.selectionIndex === index ? '#2e7d32' : '#424242'}} 
                                    onClick={ e => { this.setState({selectionIndex: index })}}>

                                    <Grid container direction="row">
                                        <Grid item container direction="row" alignItems="center" xs={1}>
                                            <Grid item xs={6}>
                                                <ListItemIcon>
                                                    <YouTubeIcon style={{ color: 'red' }}/>
                                                </ListItemIcon>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Avatar src={entry["thumbnail"]} className={classes.avatar} />
                                            </Grid>
                                        </Grid>

                                        <Grid item container direction="row" alignItems="center" xs={8}>
                                            <Grid item>
                                                <ListItemText
                                                    primary={entry["title"]}
                                                    secondary={entry["channel"]}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item container direction="row-reverse" alignItems="center" justify="flex-start" xs={3}>
                                            <Grid item>
                                                <IconButton color="inherit">
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
            <YouTube ref={this.playerRef} stateChanged={this.stateChangedCallback} onElapsed={this.elapsedCallback}/>
            </>
       ) 
    }

    onMediaMainButton = () => {
        switch(this.state.mediaState) {
            case -1: // Play
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

    getCurrentTrack = () => {
        if (this.state.selectionIndex < 0) {
            return null
        }
        return this.state.searchResults[this.state.selectionIndex]
    }

    MediaPlayer = () => {
        const { classes } = this.props
        return (

            <>
                <Grid container alignItems="center">

                    <Grid item container alignItems="center" justify="flex-start" xs={2}>
                        <Grid item xs={3}>
                            <Avatar src={this.getCurrentTrack() !== null ? this.getCurrentTrack()["thumbnail"] : ''} className={classes.avatar} />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography noWrap="true" variant="subtitle1">{this.getCurrentTrack() !== null ? this.getCurrentTrack()["title"] : 'Title'}</Typography>
                            <Typography noWrap="true" variant="caption">{this.getCurrentTrack() !== null ? this.getCurrentTrack()["channel"] : 'Artist'}</Typography>
                        </Grid>
                    </Grid>

                    <Grid item container direction="column" alignItems="center" justify="center" xs={8}>
                        <Grid item>
                            <Toolbar>
                                <IconButton color="inherit">
                                    <SkipPrevious />
                                </IconButton>
                                <IconButton color="inherit" onClick={ () => this.onMediaMainButton() }>
                                    { this.state.mediaState === -1 ? <PlayCircleOutline className={classes.mediaMainButton}/> : <PauseCircleOutline className={classes.mediaMainButton}/> }
                                </IconButton>
                                <IconButton color="inherit">
                                    <SkipNext />
                                </IconButton>
                                <IconButton color="inherit">
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
                                    <Slider value={this.state.currentSeconds} max={this.state.totalSeconds} step={1} onChange={ this.setSeconds }/>
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
                                <QueueMusic />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="inherit">
                                { this.state.volume === 0 ? <VolumeOff /> : <VolumeUp /> }
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <div className={classes.volumeSlider}>
                                <Slider value={this.state.volume} step={1} onChange={ this.setVolume }/>
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
                <AppBar className={classes.appBar} position="relative">
                    <Toolbar position="static">
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item>
                                <Typography variant="h6">COALITION</Typography>
                            </Grid>
                            <Grid item>
                                <SearchBar searchResultsChanged={this.searchResultsCallback}/>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <main>
                    { this.MainContent() }
                </main>
                <AppBar position="fixed" color="primary" className={classes.mediaBar}>
                    { this.MediaPlayer() }
                </AppBar>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(App);

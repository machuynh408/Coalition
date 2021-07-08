import './App.css';
import React from 'react'
import SearchBar from './SearchBar';
import YouTube from './YouTube'

// Material-UI
import { Typography, AppBar, Avatar, CssBaseline, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, withStyles } from '@material-ui/core';
import { primaryBlack } from './Colors';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import YouTubeIcon from '@material-ui/icons/YouTube';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

// MediaBar
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import RepeatIcon from '@material-ui/icons/Repeat';
import Slider from '@material-ui/core/Slider';

// MediaRight
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

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
    },
    mediaMainButton: {
        height: 50,
        width: 50
    },
    mediaSlider: {
        width: 700,
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
        searchResults: [
        ],
        volume: 50,
        selectionIndex: -1
    }

    playerRef = (player) => {
        this.player = player
    }

    searchResultsCallback = (value) => {
        this.setState({ searchResults: value })
        if (this.state.searchResults.length > 0) {
            this.setState({ selectionIndex: 0 })
        }
        else {
            this.setState({ selectionIndex: -1 })
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
        this.player.setVolume(this.state.volume)
    }

    onSearchPlay = (index) => {
        const videoId = this.state.searchResults[index]["videoId"]
        this.player.play(videoId)
    }

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
                                                    <PlaylistAddIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item>
                                                <IconButton color="inherit" onClick={ () => this.onSearchPlay(index) }>
                                                    <PlayArrowIcon />
                                                </IconButton>
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
            <YouTube ref={this.playerRef}/>
            </>
       ) 
    }

    onMediaMainButton = () => {
        this.player.play()
    }

    MediaPlayer = () => {
        const { classes } = this.props
        return (
            <Grid container direction="column" alignItems="center" justify="center">
                <Grid item>
                    <Toolbar>
                        <IconButton color="inherit">
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={ () => this.onMediaMainButton() }>
                            <PlayCircleOutlineIcon className={classes.mediaMainButton}/>
                        </IconButton>
                        <IconButton color="inherit">
                            <SkipNextIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <RepeatIcon />
                        </IconButton>
                    </Toolbar>
                </Grid>
                <Grid item container direction="row" spacing={2} justify="center" alignItems="center">
                    <Grid item>
                        <div className={classes.mediaSlider}>
                            <Slider value={0} />
                        </div>
                    </Grid>
                    <Grid item>
                        <Typography variant="h7">0:00 / 0:00</Typography>
                    </Grid>
                </Grid>
            </Grid>
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
                    <Grid container direction="row" alignItems="center">
                        <Grid item xs={2}>

                        </Grid>
                        <Grid item xs={8}>
                            { this.MediaPlayer() } 
                        </Grid>
                        <Grid item xs={2}>
                            <Grid item container direction="row" spacing={1} justify="center" alignItems="center">
                                <Grid item>
                                    <IconButton color="inherit">
                                        <QueueMusicIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton color="inherit">
                                        { this.state.volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon /> }
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <div className={classes.volumeSlider}>
                                        <Slider value={this.state.volume} step={1} onChange={ this.setVolume }/>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </AppBar>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(App);

import './App.css';
import React from 'react'
import SearchBar from './SearchBar';

// Material-UI
import { Typography, AppBar, CssBaseline, Grid, Toolbar, withStyles } from '@material-ui/core';
import { primaryBlack } from './Colors';

const useStyles = (theme) => ({
    appBar: {
        backgroundColor: primaryBlack,
        maxHeight: 70,
    }
});

class App extends React.Component {
    render() {
        const { classes } = this.props

        return (
            <>
                <CssBaseline />
                <AppBar className={classes.appBar} position="relative">
                    <Toolbar position="static">
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item>
                                <Typography variant="h6">COALITION</Typography>
                            </Grid>
                            <Grid item>
                                <SearchBar />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(App);

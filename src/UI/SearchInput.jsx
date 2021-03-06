import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { MenuItem, Select, withStyles } from '@material-ui/core';
import { primaryBlue } from '../Colors';

const useStyles = (theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 5,
        width: '500px',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        color: 'black'
    },
    inputField: {
        paddingLeft: theme.spacing(2),
        fontSize: 14,
    },
    iconButton: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(0.5),
        background: primaryBlue,
        '& svg': {
            fill: theme.palette.Paper,
        },
    },
    select: {
        color: 'black'
    }
});

class SearchInput extends React.Component {

    state = {
        searchValue: "",
        selectValue: 1
    }

    render() {
        const { classes } = this.props
        return (
            <Paper className={classes.root}>
                <InputBase
                    className={classes.input}
                    placeholder="Search..."
                    inputProps={{ 'aria-label': 'id no.', className: classes.inputField }}
                    value={this.state.searchValue}
                    onChange={e => { 
                        this.setState({searchValue: e.target.value}); 
                        this.props.textChanged(e.target.value) }}
                />
                
                <Select disableUnderline 
                    label="Age" 
                    value={this.state.selectValue}
                    className={classes.select}
                    onChange={e => {
                            this.setState({selectValue: e.target.value});
                            this.props.selectChanged(e.target.value)}
                        }>

                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={1}>YouTube</MenuItem>
                    <MenuItem value={2}>Spotify</MenuItem>
                </Select>
            </Paper>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(SearchInput)
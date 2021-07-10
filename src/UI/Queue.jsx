import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Typography } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  dialog: {
    width: '50%'
  }
});

class Queue extends React.Component {

    state = {
        visible: false,
        data: []
    }

    setVisibility = (value) => this.setState({ visible: value })

    add = (media) => {
        // var results = [...this.state.data]
        // results.push(media)
        // this.setState({ data: results})
    }

    render() {

      const { classes } = this.props

      return (
        <Dialog onClose={ () => this.setVisibility(false) } aria-labelledby="simple-dialog-title" open={this.state.visible}>
          <DialogTitle style={{ color: 'black', width: '500px' }}>Queue</DialogTitle>
          <Divider dark />
          <DialogContent>
            <List>
                {
                    this.state.data.map((entry, index) => {
                        return (
                            <>
                              <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar src={entry["thumbnail"]} className={classes.avatar} />
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={<Typography variant="h6" style={{ color: 'black' }}>entry["title"]</Typography>} 
                                  secondary={entry["channel"]}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete">
                                      <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </>
                        )
                    })
                }
            </List>
          </DialogContent>
          <Divider dark />
          <DialogActions>

        </DialogActions>
        </Dialog>
      );
    }
}

export default withStyles(useStyles, {withTheme: true})(Queue)
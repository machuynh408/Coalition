import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Typography } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete';
import AlbumIcon from '@material-ui/icons/Album';
import { blue } from '@material-ui/core/colors';

const useStyles = (theme) => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    dialog: {
        width: '50%'
    },
    album: {
        color: blue[600],
        width: theme.spacing(5),
        height: theme.spacing(5)
    },
    clearButton: {
        color: blue[600]
    },
    closeButton: {
        color: 'red'
    },
});

class Queue extends React.Component {

    state = {
        visible: false,
        data: [],
        position: -1
    }

    setVisibility = (value) => this.setState({ visible: value })

    add = (media) => this.setState(prevState => ({ data: [...prevState.data, media] }))

    remove = (index) => {
        if (index < 0) {
            return
        }
        var arr = [...this.state.data]
        arr.splice(index, 1)
        this.setState({ data: arr })
    }

    clear = () => this.setState( { data: [] })

    prev = () => {
        const curr = this.state.position
        const size =  this.state.data.length - 1
        if (curr - 1 < 0 || curr - 1 > size) {
            return
        }
        this.setState({ position: this.state.position - 1 }, () => this.changeMedia())
    }

    next = () => {
        const curr = this.state.position
        const size =  this.state.data.length - 1
        if (curr + 1 > size) {
            return
        }
        this.setState({ position: this.state.position + 1 }, () => this.changeMedia())
    }

    selectMedia = (index) => this.setState({ position: index }, () => this.changeMedia())

    changeMedia = () => {
        const media = this.state.data[this.state.position]
        this.props.onQueueChanged(media)
    }

    render() {

      const { classes } = this.props

      return (
          <Dialog onClose={ () => this.setVisibility(false) } aria-labelledby="simple-dialog-title" open={this.state.visible}>
              <DialogTitle style={{ color: 'black', width: '500px' }}>Queue</DialogTitle>
                  <DialogContent>
                      <List dense={false}>
                        <Divider dark />
                          {
                              this.state.data.map((entry, index) => {
                                  return (
                                      <>
                                        <ListItem key={index} onClick={ () => this.selectMedia(index) }>
                                          <ListItemAvatar>
                                              { this.state.position == index ? <AlbumIcon className={classes.album}/> : <Avatar src={entry["thumbnail"]} className={classes.avatar} /> }
                                          </ListItemAvatar>
                                          <ListItemText 
                                            primary={<Typography variant="h6" style={{ color: 'black' }}>{entry["title"]}</Typography>} 
                                            secondary={entry["channel"]}
                                          />
                                          <ListItemSecondaryAction>
                                              <IconButton edge="end" aria-label="delete" onClick={ () => this.remove(index) }>
                                                <DeleteIcon />
                                              </IconButton>
                                          </ListItemSecondaryAction>
                                        </ListItem>
                                        { index === this.state.data.length - 1 ? <></> : <Divider variant="inset" component="li" /> }
                                      </>
                                  )
                              })
                          }
                        <Divider dark />
                      </List>
                  </DialogContent>
                <DialogActions>
                    <Button className={classes.clearButton} onClick={ () => this.clear() }>Clear</Button>
                    <Button className={classes.closeButton} autoFocus onClick={ () => this.setVisibility(false) }>Close</Button>
                </DialogActions>
          </Dialog>
      );
    }
}

export default withStyles(useStyles)(Queue)
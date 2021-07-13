import React, { useContext } from 'react';
import {Button, Grid, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    video: {
      justifyContent: 'center',
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      justifyContent: 'center',
      padding: '10px',
      border: '5px solid black',
      margin: '10px',
    },
}));

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call,muteUnmuteV,muteUnmuteA,shareScreen } = useContext(SocketContext);
    const classes = useStyles();
    
    return(
        <Grid container className={classes.gridContainer}>
            {/* our video */}
            {stream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>{name || 'Name'}</Typography>
                        <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                    </Grid>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button variant="contained"  color="secondary"  onClick={muteUnmuteV} className={classes.margin}>
                        Video ON/OFF
                    </Button>
                    <Button variant="contained" color="secondary"  onClick={muteUnmuteA} className={classes.margin}>
                        Audio ON/OFF
                    </Button>
                    <Button variant="contained" color="secondary"  onClick={shareScreen} className={classes.margin}>
                        Screen Share
                    </Button>
                    
                    </div>
                </Paper>
            )}   
            {/* user's video */}
            {callAccepted && !callEnded && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>{call.name || 'Name'}</Typography>
                        <video playsInline ref={userVideo} autoPlay className={classes.video} />
                    </Grid>
                </Paper>
            )}    
        </Grid>
    );
}

export default VideoPlayer;
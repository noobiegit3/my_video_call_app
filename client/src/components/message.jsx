import React,{ useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./messagestyle.css";
import { Button, Grid, Typography, Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";
import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
    },
  },
  container: {
    justifyContent: 'center',
    width: '600px',
    margin: '0px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    }
  },
  
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 0,
  },
  paper: {
    justifyContent: 'center',
    padding: '0px 0px',
    border: '4px solid black',

  },
}));



const Message =() =>{
  const {users,message,messages,submit,setMessage} =useContext(SocketContext);
  const classes = useStyles();
  
  return(
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <Grid container className={classes.gridContainer}>
          <Typography variant="h4" >Messenger</Typography>
          <div id="messages" class="overflow-auto">
            {messages.map(({ user, date, text }, index) => (
              <div key={index} class="row">
                <div  class="left"><h7><b>{user.name}</b></h7></div>
                <div class="middle" ><i>{moment(date).format("h:mma")}</i></div>
                <div class="right" >{text}</div>
              </div>
            ))}
          </div>
            
          <form onSubmit={submit} id="form">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control" 
                  onChange={e => setMessage(e.currentTarget.value)}
                  value={message}
                  id="text"/>
                <span className="input-group-btn">
                  <Button variant="contained" color="secondary" id="submit" type="submit"  onClick={submit} className={classes.margin}>
                    Send
                  </Button>
                </span>
              </div>
          </form>
        </Grid>
      </Paper>
                    
      <Paper elevation={10} className={classes.paper}>
        <div align="left" className="col-md-4" >
          <h5>Users Online</h5>
          <ul id="users">
            {users.map(({ name, id }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </div>
      </Paper>
    </Container>
  );
}

export default Message;
const app = require("express")();
const server=require("http").createServer(app);
const cors = require("cors");
const io=require("socket.io")(server, {
  cors:{
      origin: "*",
      methods: ["GET","POST"]
  }
});

const users = {};

app.use(cors());
const PORT = process.env.PORT || 5000;

app.get('/', (req,res) => {
    res.send('kritika was here')
})

io.on('connection',(socket) => {
  socket.emit('me',socket.id);
  
  socket.on('disconnect', () => {
    socket.broadcast.emit("callended");
  });
  
  socket.on("calluser",({userToCall, signalData, from, name}) => {
    io.to(userToCall).emit("calluser",{ signal: signalData, from, name});
  });
  
  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted",data.signal);
  })

  socket.on("username", username => {
    const user = {
      name: username,
      id: socket.id
    };
    users[socket.id] = user;
    io.emit("connected", user);
    io.emit("users", Object.values(users));
  });
    
  socket.on("send", message => {
    io.emit("message", {
      text: message,
      date: new Date().toISOString(),
      user: users[socket.id]
    });
  });
    
  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit("disconnected", socket.id);
  });
});

server.listen(PORT,() => console.log(`server listening on port ${PORT}`));

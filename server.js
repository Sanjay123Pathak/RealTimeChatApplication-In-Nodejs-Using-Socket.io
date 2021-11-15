                        const http=require('http');
                        const express=require('express');
                        const path=require('path');
                        const app=express();
                        const server=http.createServer(app);
                        const port=process.env.port || 5000;

                        // serve the public folder both are correct
                        // app.use(express.static(__dirname+'public'));
                        app.use(express.static('public'));


                        // giving the root to the server to get in the web page
                        app.get('/',(req,res)=>{
                        res.sendFile(__dirname+'/index.html');
                        });

                        //socket.io setup

                        const io=require("socket.io")(server);
                         var users={};
                        io.on('connection',(socket)=>{
                                  socket.on("new-user-joined",(username)=>{
                                       users[socket.id]=username;
                                       socket.broadcast.emit('user-connected',username);
                                       // 
                                       io.emit("user-list",users);
                                      //  console.log(users);
                                 });
                        // now for disconnected user so wahi disconnect hogaya jo connected 
                                 socket.on('disconnect',()=>{
                                   // here we are getting the id of socket who is going to be disconnect and 
                                   //storing in the var disconnected_users
                                  socket.broadcast.emit("user-disconnected",user=users[socket.id]);
                                  // now deleting the user
                                  delete users[socket.id];
                                  io.emit("user-list",users);

                                 });

                                 socket.on('message',(data)=>{
                                   socket.broadcast.emit("message",{user:data.user,msg:data.msg});
                                 });

                                 // for whois tying here typing 
                                 socket.on("typing",function(data){
                                   socket.broadcast.emit("typing",{user:data.user});
                                  //  io.emit("typing",data)
                                 });
                        // console.log(socket.id);
                        //print socket id each times whenevr we refresh it
                     });




                        // socket ends
                        server.listen(port,()=>{
                        console.log("Server started at port number " +port);
                        });

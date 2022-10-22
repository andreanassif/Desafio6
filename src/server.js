const express = require('express')
const { Server } = require ('socket.io')

const app = express()


const PORT = process.env.PORT || 8080
const server = app.listen(PORT, ()=>console.log(`Server ready on port ${8080}`))


const io = new Server(server)

app.use(express.static(__dirname+'/public'))

//levantar socket del servidor
const historicoMensajes = [];

io.on("connection",(socket)=>{
    console.log("nuevo usuario conectado", socket.id);
    //enviar a todos menos al socket conectado
    socket.broadcast.emit("newUser");
    socket.emit("historico",historicoMensajes)
    socket.on("message",data=>{
        console.log(data);
        historicoMensajes.push(data);
        //enviar a todos
        io.sockets.emit("historico",historicoMensajes);
    })
})



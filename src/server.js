const express = require('express')
const optionConfig = require("./config/optionConfig.js")
const { Server } = require ('socket.io')
const ContenedorMysql = require("./managers/contenedorMysql.js")
const ContenedorSql = require("./managers/contenedorSql");

const app = express()
const productosApi = new ContenedorMysql(option.mariaDB, "products")
const chatApi = new ContenedorSql(options.sqliteDB,"chat");

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, ()=>console.log(`Server ready on port ${8080}`))


const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))


// routes
//view routes
app.get('/', async(req,res)=>{
    res.render('home')
})

app.get('/productos',async(req,res)=>{
    res.render('products',{products: await productosApi.getAll()})
})

//api routes
app.use('/api/products',productsRouter)

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



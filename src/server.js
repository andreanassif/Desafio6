const express = require('express')
const options = require("./config/optionConfig.js")
const {router} = require("./routes/product.js");
const { Server } = require ('socket.io')
const {normalize, schema} = require("normalizr")
const ContenedorMysql = require("./managers/contenedorMysql.js")
const ContenedorSql = require("./managers/contenedorProductos.js");
const ContenedorChat = require("./managers/contenedorChat.js");
const { Router } = require('express');

const productosApi = new ContenedorMysql(options.mariaDB, "products")
const chatApi = new ContenedorChat("chat.txt");
//const chatApi = new ContenedorSql(options.sqliteDB,"chat");

const app = express()
const PORT = process.env.PORT || 8081
const server = app.listen(PORT, ()=>console.log(`Server ready on port ${PORT}`))


const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//normalizacion
//creacion de esquemas
//esquema del autor           3params          nombre  /  objeto o subesquemas / idAtribute
const authorSchema = new schema.Entity("authors", {}, {idAttribute: "email"} )

//esquema del mensaje 2 param, porque el mssg ya tiene el id
const messageSchema = new schema.Entity("mesages", {
    author: authorSchema
})

//crear nuevo objeto para normalizar todo

//esquema global

const chatSchema = new schema.Entity("chat", {
    messages: [ messageSchema]
}, {idAttribute: "id"})

//aplico normalizacion

const normalizarData = (data)=>{
    const normalizeData = normalize({id: "chatHistory", messages: data}, chatSchema )
    return normalizeData
}

const normalizarMensajes = async()=>{
    const results = await chatApi.getAll();
    const messagesNormalized = normalizarData(results);
    // console.log(JSON.stringify(messagesNormalized, null,"\t"));
    return messagesNormalized;
}

// routes
//view routes
/* app.get('/', async(req,res)=>{
    res.render('home')
})

app.get('/productos',async(req,res)=>{
    res.render('products',{products: await productosApi.getAll()})
}) 
 */
//api routes
app.use('/api/products', Router)

//faker routes
app.use('/productos-test', Router)


//levantar socket del servidor
const historicoMensajes = [];

io.on("connection", async (socket)=>{
    console.log("nuevo usuario conectado", socket.id);
    //enviar a todos menos al socket conectado
    socket.broadcast.emit("newUser");
    //socket.emit("historico",historicoMensajes)

    io.sockets.emit("messages", await normalizarMensajes())

    socket.on("message", async (newMsg)=>{
        console.log(newMsg);
        await chatApi.save(newMsg)

        historicoMensajes.push(newMsg);
        //enviar a todos
        io.sockets.emit("messages", await normalizarMensajes());
    })
})



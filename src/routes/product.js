const express = require("express");
const {productosTest} = require("../managers/faker.js")
//const Contenedor = require("../managers/contenedorProductos");
const ContenedorSql = require("../managers/contenedorMysql.js");
const options = require("../config/optionConfig.js");
const {session, Cookie} = require("express-session");
const router = express.Router();



// const productosApi = new Contenedor("productos.txt");
const productosApi = new ContenedorSql(options.mariaDB, "products");

router.get('/',async(req,res)=>{
    const productos = await productosApi.getAll();
    res.send(productos);
})

router.get('/:id',async(req,res)=>{
    const product = await productosApi.getById(parseInt(productId));
    if(product){
        return res.send(product)
    } else{
        return res.send({error : 'producto no encontrado'})
    }
})

router.post('/',async(req,res)=>{
    const newProduct = req.body;
    const result = await productosApi.save(newProduct);
    res.send(result);
})

router.put('/:id',async(req,res)=>{
    const cambioObj = req.body;
    const productId = req.params.id;
    const result = await productosApi.updateById(parseInt(productId),cambioObj);
    res.send(result);
})

router.delete('/:id',async(req,res)=>{
    const productId = req.params.id;
    const result = await productosApi.deleteById(parseInt(productId));
    res.send(result);
})

router.get('/productos-test', (req,res)=>{
   req.body = productosTest.value
    res.send(
        console.log(productosTest)
        )

})

//rutas cookies, session & storage

router.get("/login",(req,res)=>{
    const {user} = req.query;
    if(req.session.username){
        return res.redirect("/perfil")
    } else{
        if(user){
            req.session.username = user;
            res.send("sesion iniciada");
        } else{
            res.send("por favor ingresa el usuario")
        }
    }
});

const checkUserLogged = (req,res,next)=>{
    if(req.session.username){
        next();
    } else{
        res.redirect("/login");
    }
}

router.get("/perfil",checkUserLogged,(req,res)=>{
    console.log(req.session);
    res.send(`Bienvenido ${req.session.username}`);
});

router.get("/home",checkUserLogged,(req,res)=>{
    console.log(req.session);
    res.send("home");
});


router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.send("sesion finalizada")
});

module.export = {Router: router}
const options = require("../config/optionConfig.js")
const knex = require("knex")

// instance DB

const dbmysql = knex(options.mariaDB)
const dbSqlite = knex(options.sqliteDB)

const createTable = async ()=>{
    //verificar q la tabla existe en la bd
    const tableProductExists = await dbmysql.schema.hasTable("products")
    if(tableProductExists){
        await dbmysql.schemaa.dropTable("products")
    }
    //creamos la tabla
    await dbmysql.schema.createTable("products", table=>{
        //definimos los campor de los items
         table.increments("id")
         table.string("nombre", 50).nullable(false)
         table.integer("precio")
         table.string("img", 200)
    })
    console.log("tableProduct se creó correctamente")
    dbmysql.destroy()
}

createTable()
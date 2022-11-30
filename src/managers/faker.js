const { faker } = require('@faker-js/faker');

const {datatype, commerce, image}= faker

faker.locale = 'es'

let productosTest = []

for(let i = 0; i<5;i++){
    productosTest.push({
        id: datatype.uuid(),
        name: commerce.product(),
        price: commerce.price(),
        descpription: commerce.productDescription(),
        image: image.abstract()
       
    })
}
   
module.export = { productosTest }
   
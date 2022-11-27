

console.log("javascript funcionando");

const socketClient = io();

let user;

/* Swal.fire({
    title:"Hola usuario",
    text:"bienvenido, ingresa tu usario",
    input:"text",
    allowOutsideClick:false
}).then(respuesta=>{
    // console.log(respuesta)
    user = respuesta.value;
});
 */

Swal.fire({
    title: 'Formulaario de Perfil',
    html: `<input type="text" id="email" class="swal2-input" placeholder="e-mail">
    <input type="text" id="name" class="swal2-input" placeholder="Nombre">
    <input type="text" id="lastname" class="swal2-input" placeholder="Apellido">
    <input type="number" id="age" class="swal2-input" placeholder="Edad">
    <input type="text" id="alias" class="swal2-input" placeholder="Alias">
    <input type="text" id="avatar" class="swal2-input" placeholder="Foto">`,
    confirmButtonText: 'Iniciar',
    focusConfirm: false,
    preConfirm: () => {
      const email = Swal.getPopup().querySelector('#email').value
      const name = Swal.getPopup().querySelector('#name').value
      const lastname = Swal.getPopup().querySelector('#lastname').value
      const age = Swal.getPopup().querySelector('#age').value
      const alias = Swal.getPopup().querySelector('#alias').value
      const avatar = Swal.getPopup().querySelector('#avatar').value
      if (!email || !name || !lastname || !age || !alias || !avatar) {
        Swal.showValidationMessage(`Por favor complete el formulario`)
      }
      return { email, name, lastname, age, alias, avatar }
    },
    allowOutsideClick:false
  }).then((result) => {
    Swal.fire(`
      email: ${result.value.email}
      name: ${result.value.name}
      lastname: ${result.value.lastname}
      age: ${result.value.age}
      alias: ${result.value.alias}
      avatar: ${result.value.avatar}
    `.trim())
    console.log(result.value)
    user = result.value
  });
  
const campo = document.getElementById("messageField")

campo.addEventListener("keydown",(evt)=>{
    console.log(evt.key)
    if(evt.key === "Enter"){
        socketClient.emit("message",{
            //username:user,
            //message:campo.value
            author: user,
            text: campo.value,
            timestamp: new Date().toLocaleString()
        })
    }
})


//esquemas
const authorSchema = new normalizr.schema.Entity("authors", {}, {idAttribute: "email"} )

const messageSchema = new normalizr.schema.Entity("mesages", {
  author: authorSchema
})

const chatSchema = new normalizr.schema.Entity("chat", {
  messages: [ messageSchema]
}, {idAttribute: "id"})


const messageContainer = document.getElementById("messageContainer");

socketClient.on("messages", async (dataMsg)=>{
  console.log("dataMsg", dataMsg)
  //de-normalizar
  const normalData = normalizr.denormalize(dataMsg.result,chatSchema,dataMsg.entities);
  // console.log("normalData",normalData)
  let messageElements = "";
  normalData.messages.forEach(msg=>{
      messageElements += `<div><strong>${msg.author.name} - ${msg.timestamp}:</strong> ${msg.text}</div>`;
  })
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.innerHTML = normalData.messages.length>0 ? messageElements : '';
    //let elementos="";
    //data.forEach(item=>{
    //    elementos = elementos + `<p><strong>${item.username}</strong>: ${item.message}</p>`;
    //});
    //messageContainer.innerHTML = elementos;
})

socketClient.on("newUser",()=>{
    Swal.fire({
        text:"nuevo usuario conectado",
        toast:true
    })
})



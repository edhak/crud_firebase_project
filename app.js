console.log('comenzando');

firebase.initializeApp({
  apiKey: "AIzaSyC5U27g9vwvgWw2DndBSyGlJBc4f6iBf6M",
  authDomain: "proyectousuario-3399b.firebaseapp.com",
  projectId: "proyectousuario-3399b",
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features //Nueva caracteritica
db.settings({
  timestampsInSnapshots: true
});

//agrrgando la base de datos
//agragando iinformación

function guardar(){
  var nombre = document.getElementById('nombre').value;
  var apellido = document.getElementById('apellido').value;
  var fecha = document.getElementById('fecha').value;

  //si cambias users se crea una nueva base de tados sino se agrega en la ya existente
  db.collection("users").add({
      first: nombre,
      last: apellido,
      born: fecha
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      //limpiamso los campos
      document.getElementById('nombre').value = '';
      document.getElementById('apellido').value = '';
      document.getElementById('fecha').value = '';
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });

}

//Leer Documentos
var tabla = document.getElementById('tabla');
db.collection("users").onSnapshot((querySnapshot) => { //cambiamos el get por el onSnapshot
    tabla.innerHTML = ''; // inicial basia la tabla
    querySnapshot.forEach((doc) => {   //forEach es un ciclo se va repitiendo segun la data que se tiene
        console.log(`${doc.id} => ${doc.data().first}`);
        tabla.innerHTML +=`
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().last}</td>
          <td>${doc.data().first}</td>
          <td>${doc.data().born}</td>
          <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
          <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().last}','${doc.data().first}','${doc.data().born}')">Editar</button></td>
        </tr>
        `;
    });
});

//Eliminar Documentos (datos de la base de datos)
function eliminar(id){
  db.collection("users").doc(id).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

//actualizar data
function editar(id, nombre, apellido, fecha){

  //solo lleva los datos de una persona al campo de edición(donde se editara)
  document.getElementById('nombre').value = nombre;
  document.getElementById('apellido').value = apellido;
  document.getElementById('fecha').value = fecha;

  var boton = document.getElementById('boton'); //seleccionalos el boton conid boton
  boton.innerHTML = 'Editar'; // le cambiamos el nombre de Guardar a editar

  boton.onclick = function(){ // y cambiamos la función de onclik, definiendo otra función

    var washingtonRef = db.collection("users").doc(id);

    //ahora cambiamos las variables para poder editarlas
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var fecha = document.getElementById('fecha').value;

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
      first: nombre,
      last: apellido,
      born: fecha
    })
    .then(function() {
        console.log("Document successfully updated!");
        boton.innerHTML = 'Guardar'; // realizado ya los cambios y depues de presionasr editar cambiamos el nombre a Guardar
        boton.onclick = guardar();
        
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('fecha').value = '';

    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

}

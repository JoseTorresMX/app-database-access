const cargarBtn = document.getElementById("cargar-btn");
const usuarioLista = document.getElementById("usuario-lista");

//funcions para mostrar la lista de usuarios
function mostrarUsuarios(usuarios) {
  usuarioLista.innerHTML = usuarios
    .map((u) => `<p>${u.nombre} - ${u.email}</p>`)
    .join("");
}

//crear un observable para la carga de usuarios
const cargarUsuarios$ = new rxjs.Observable((suscriber) => {
  fetch("http://localhost:3000/usuarios").then((response) => response.json()),
    then((data) => {
      suscriber.next(data);
      suscriber.complete();
    }).catch((err) => suscriber.error(err));
});

//subribirse al obsreable cuando el boton es clickeado
cargarBtn.addEventListener("click", () => {
  cargarUsuarios$.subcribe({
    next: mostrarUsuarios,
    error: (err) => alart("Error:" + err),
    complete: () => console.log("Datos cargados"),
  });
});

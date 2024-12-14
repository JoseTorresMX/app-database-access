const express = require("express");
const mariadb = require("mariadb");
const { Observable } = require("rxjs");

//crear conexion a db
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ejemplo_reactivo",
  //connectionLimit: 10
});

//crear uns isntancia de express
const app = express();
app.use(express.json());

//Endpoint para obtener usuarios
app.get("/usuarios", (req, res) => {
  const observable = new Observable((subscriber) => {
    pool
      .getConnection()
      .then((conn) => {
        conn
          .query("SELECT * FROM usuarios")
          .then((result) => {
            subscriber.next(result);
            subscriber.complete();
            conn.end();
          })
          .catch((err) => {
            subscriber.error(err);
            conn.end();
          });
      })
      .catch((err) => subscriber.error(err));
  });
  observable.subscribe({
    next: (data) => res.json(data),
    error: (err) => res.status(500).send("Error en la base de datos" + err),
    complete: () => console.log("consulta completa"),
  });
});

//levantar el servidor en el puerot 3000
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});

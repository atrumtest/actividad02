/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Puerto para publicar app en web
const PORT = process.env.PORT || 5000;
// Importar módulo Express
var express = require('express');
var app = express();

// Importar módulo BodyParser para uso de método POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

// Importar módulo para uso de BD
var MongoClient = require('mongodb').MongoClient;
// URI de conexión
var uri = "mongodb://unir01:FgPN0js7166O93Os@unir-shard-00-00-4so5y.mongodb.net:27017,unir-shard-00-01-4so5y.mongodb.net:27017,unir-shard-00-02-4so5y.mongodb.net:27017/actividad01?ssl=true&replicaSet=UNIR-shard-0&authSource=admin&retryWrites=true&w=majority";

// Servicio web para consultar gatitos
app.get('/gatitos',function(req,res){
    // Conectarse a BD
   MongoClient.connect(uri,function(err,db){
       if(err){
           console.log('Error al conectarse a la BD: '+err);
       }
       else {
           console.log('Conexión a BD exitosa');
           // Acceder a collection
           var collection = db.db('actividad02').collection('gatito');
           // Realizar consulta a BD
           collection.find().toArray(function(err,result){
               if(err){
                   console.log('Error en la consulta: '+err);
               }
               else {
                   // Retornar estado OK
                   res.status(200);
                   // Retornar consulta en formato JSON
                   res.json(result);
                   // Cerrar con. a BD
                   db.close();
               }
           });
       }
   }); 
});

// Servicio para insertar gatitos
app.post('/gatitos',function(req,res){
    // Conectarse a BD
   MongoClient.connect(uri,function(err,db){
       if(err){
           console.log('Error al conectarse a la BD: '+err);
       }
       else {
           console.log('Conexión a BD exitosa');
           // Obtener datos a insertar en BD
           var gatito = {
               nombre:req.body.nombre,
               genero:req.body.genero,
               edad:req.body.edad,
               esterilizado:req.body.esterilizado,
               pelaje:req.body.pelaje,
               vacunas:req.body.vacunas
           };
           console.log('Datos a insertar: '+JSON.stringify(req.body));
           // Acceder a collection
           var collection = db.db('actividad02').collection('gatito');
           // Insertar datos
           collection.insert(gatito,function(err,result){
               if(err){
                   console.log('Error al insertar en BD: '+err);
                   res.json({
                       insertado:false
                   });
               }
               else{
                   // Enviar código de estado para creado
                    res.status(201);
                    // Mostrar resultado en JSON
                    res.json({
                        insertado:true
                    });
                    // Cerrar BD
                    db.close();
               }
           });
       }
           
    });
});

// Configuración de servidor
app.listen(PORT, function(){
    console.log('Servidor Listo');
});
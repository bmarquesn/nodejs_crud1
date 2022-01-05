const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000; //porta web padrão
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/** functions */
function execSQLQuery(sqlQry, res, values = null, update = null){
    const connection = mysql.createConnection({
        host     : '127.0.0.1',
        port     : 3306,
        user     : 'root',
        password : '',
        database : 'crud_nodejs'
    });

    if(values !== null) {
        if(update !== null) {
            var valores = values;
        } else {
            var valores = [values];
        }
        connection.query(sqlQry, valores, function(error, results){
            if(error) {
                res.json(error);
            } else {
                res.json(results);
            }
        });
    } else {
        connection.query(sqlQry, function(error, results){
            if(error) {
                res.json(error);
            } else {
                res.json(results);
            }
        });
    }

    connection.end();
    console.log('executou SQL!');
}

//definindo as rotas
/** index */
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);
/** cliente(s) */
router.get('/clientes/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE ID = ' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM Clientes' + filter, res);
});
router.delete('/clientes/:id?', (req, res) =>{
    const newLocal = 'DELETE FROM Clientes WHERE ID = ';
    execSQLQuery(newLocal + parseInt(req.params.id), res);
});
router.post('/clientes', (req, res) =>{
    const sql = 'INSERT INTO Clientes(Nome, CPF) VALUES(?)';

    const values = [req.body.name, req.body.cpf];
    execSQLQuery(sql, res, values);
});
router.put('/clientes/:id', (req, res) =>{
    const sql = 'UPDATE Clientes SET Nome = ?, CPF = ? WHERE id = ?';

    const values = [req.body.name, req.body.cpf, parseInt(req.params.id)];
    execSQLQuery(sql, res, values, true);
});

//inicia o servidor
app.listen(port);
console.log('API funcionando!');
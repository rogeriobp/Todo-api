var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todosnextId = 1;

app.use(bodyParser.json());

// GET /todos
app.get('/todos', function(req,res){
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
//    var matchedTodo;
//    
//    todos.forEach(function(todo){
//        if (todoId === todo.id) {
//            matchedTodo = todo;
//        }
//    });
    
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function(req,res) {
    var body = req.body;
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    
//    if (todos === undefined){
//        body.id = 1;
//    } else {
//        body.id = todos.length + 1;
//    }

    body.id = todosnextId++;
    
    todos.push(body);
    
    res.json(body);
});

app.get('/', function(req, res){
    res.send('Todo API Root');
});

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});
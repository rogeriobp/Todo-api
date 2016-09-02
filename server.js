var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todosnextId = 1;

app.use(bodyParser.json());

// GET /todos?completed=true
app.get('/todos', function(req,res){
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    
//    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
//        filteredTodos = _.filter(filteredTodos, function(p){return p.description.includes(queryParams.q);});
//    }
    
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo){
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }
    
    res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
        
    db.todo.findById(todoId).then(function(matchedTodo) {
//        if (matchedTodo !== null) {
        if (!!matchedTodo){
            res.json(matchedTodo.toJSON());
        } else {
            res.status(404).send();
        }}, function(e){
            res.status(500).json(e);
        });
    
//    var matchedTodo = _.findWhere(todos, {id: todoId});
//    var matchedTodo;
//    
//    todos.forEach(function(todo){
//        if (todoId === todo.id) {
//            matchedTodo = todo;
//        }
//    });
    
//    if (matchedTodo) {
//        res.json(matchedTodo);
//    } else {
//        res.status(404).send();
//    }
});

// POST /todos
app.post('/todos', function(req,res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });
    
    
//    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
//        return res.status(400).send();
//    }
    
    // set body.description to be trimmed value
//    body.description = body.description.trim();
    
//    if (todos === undefined){
//        body.id = 1;
//    } else {
//        body.id = todos.length + 1;
//    }

//    body.id = todosnextId++;
//    
//    todos.push(body);
//    
//    res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req,res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if (matchedTodo) {
        res.json(todos.splice(todos.indexOf(matchedTodo),1)); //todos = _.without(todos, matchedTodo)
//        res.json(matchedTodo);
    } else {
        res.status(404).json({"error": "no todo found with that id"});
    }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    
    if (!matchedTodo) {
        return res.status(404).send();
    }
    
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >= 1 ) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send;
    }
    
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

app.get('/', function(req, res){
    res.send('Todo API Root');
});

db.sequelize.sync().then(function () {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
}).catch(function(e){
    console.log(e);
});

//app.listen(PORT, function(){
//    console.log('Express listening on port ' + PORT + '!');
//});
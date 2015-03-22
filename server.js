#!/usr/bin/env node

'use strict';

var util = require('util'),
    express = require('express'),
    path = require('path'),
    socketIo = require('socket.io'),
    http = require('http'),
    readline = require('readline'),
    colors = require('colors/safe');

var manifest = require('./package.json');

var program = require('commander')
    .version(manifest.version)
    .usage('[options}')
    .description('start the portal server')
    .option('-p, --port <port>', 'set server port')
    .option('-i, --ip <ip>', 'IP for the server to bind to')
    .parse(process.argv);

var port =  program.port || 8000,
    address = program.ip,
    app = express(),
    server = http.Server(app),
    io = socketIo(server);

server.listen(port, address);
app.use('/', express.static(path.join(__dirname, 'public'), {
        index: 'blue.html',
        setHeaders: function(res) {
            res.set('cache-control', 'no-cache');
        }
    })
);

io.on('connection', function(socket) {
    socket.on('blue', onBlue);
});

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', onLine);

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

rl.setPrompt(util.format('%s:%s> ', address || '*', port));
rl.prompt();

var buffer = '',
    timeoutHandle = null;

function onLine(line) {
    schedule(line);
    rl.prompt();
}

function schedule(line) {
    if (timeoutHandle !== null) clearTimeout(timeoutHandle);

    buffer += (line + '\n');
    timeoutHandle = setTimeout(function() {
        timeoutHandle = null;
        send(buffer);
        buffer = '';
    }, 1000);
}

function onBlue(data) {
    process.stdout.write(colors.red('\n' + data + '\n'));
    rl.prompt();
}

function send(data) {
    io.sockets.emit('orange', buffer);
}

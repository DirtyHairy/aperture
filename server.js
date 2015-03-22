#!/usr/bin/env node

/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Christian Speckner
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

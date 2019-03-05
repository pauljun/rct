const fs = require('fs');
const EventEmitter = require('events').EventEmitter; 
const event = new EventEmitter()
module.exports = {
  readdir:function(path){
    return new Promise((resolve, reject) => {
      fs.readdir(path, 'utf8', function(err, data) {
        err ? reject(err) : resolve(data);
      });
    });
  },
  readFile: function(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function(err, data) {
        err ? reject(err) : resolve(data);
      });
    });
  },
  writeFile: function(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, 'utf-8', function(err) {
        err ? reject(err) : resolve();
      });
    });
  },
  mkdir: function(path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, { recursive: true }, err => {
        err ? reject(err) : resolve();
      });
    });
  },
  event
};

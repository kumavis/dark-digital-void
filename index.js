var fs = require('fs')
var tty = require('tty')
var path = require('path')
var Transform = require('stream').Transform

var currentPath = process.cwd()
var currentPathFiles = []

var rs = tty.ReadStream()

var controlStream = Transform()
controlStream._write = function(buffer,type,callback){
  // stringify input, cut off newline
  var command = buffer.toString().slice(0,-1)
  callback(null)
  handleCommandString(command)
}

rs.pipe(controlStream)

startGame()

// start game
function startGame() {
  // print out intro
  console.log(fs.readFileSync(__dirname+'/intro.txt').toString())
  choosePath('')
}

function gameStep() {
  console.log('there is a path up')
  currentPathFiles.map(function(file){
    console.log('you see a file:',file)
  })
}

function handleCommandString(command){
  var tokens = command.split(' ')
  var primary = tokens[0]
  // see if they are trying to go up
  if (primary === 'up' || primary === '..') return choosePath('..')
  // see if they are trying to look at a file
  if (primary === 'look') return lookFile(tokens[1])
  // if they only specfied a file, assume they want to look at it
  var targetFileIndex = currentPathFiles.indexOf(primary)
  if (-1 !== targetFileIndex) return lookFile(primary)
}

function choosePath(chosenPath){
  currentPath = path.join(currentPath,chosenPath)
  fs.readdir(currentPath,function(err,items){
    currentPathFiles = items
    gameStep()
  })
}

function lookFile(chosenFile){
  var targetFile = path.join(currentPath,chosenFile)
  fs.stat(targetFile,function(err,stats){
    console.log('It is an ordinary looking file, not too big. In letters glowing against the dark digital void, some cryptic details are written.')
    console.log(stats)
  })
}
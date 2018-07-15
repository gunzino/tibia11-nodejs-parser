'use strict';


const fs = require('fs'),
  appearancesLib = require('./src/Appearances'),
  spriteDump = require('./src/SpriteDump');

var sprites = new spriteDump();
var appearances = new appearancesLib();
appearances.load().then(function() {
  var citizenOutift = appearances.getOutfitById(136);
  var plateArmor = appearances.getItemById(2463);
  appearances.save('test.dat');
});

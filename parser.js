'use strict';

const defaultFileName = 'appearances.dat';

const fs = require('fs'),
  appearancesLib = require('./src/Appearances'),
  spriteDump = require('./src/SpriteDump');

var sprites = new spriteDump();
var appearances = new appearancesLib();
appearances.load().then(function() {
  for (var i = 0; i < appearances.catalog.length; i++) {
    if (appearances.catalog[i].type == 'sprite') {
        sprites.DecodeSpritesheet(appearances.catalog[i].file);
        if (i > 1) {
        break;
      }
    }
  }
  var citizenOutift = appearances.getOutfitById(136);
  var plateArmor = appearances.getItemById(2463);
  appearances.save('test.dat');
});

'use strict';

const defaultFileName = 'appearances.dat';

const  fs = require('fs'),
  appearancesLib = require('./src/appearances'),
  argv = require('minimist')(process.argv.slice(2), {
    alias: {
      'file': 'f'
    },
    default: {
      'file': defaultFileName
    }
  });

  var appearances = new appearancesLib();
  appearances.loadFile(argv.file).then(function() {
    var citizenOutift = appearances.getOutfitById(136);
    var plateArmor = appearances.getItemById(2463);
  });

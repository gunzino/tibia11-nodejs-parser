'use strict';

const ProtoBuf = require('protobufjs'),
  fs = require('fs');

function Appearances() {
  this.loaded = false;
}


Appearances.prototype.load = async function() {
  try {
    this.protoRoot = await ProtoBuf.load("./proto/appearances.proto");
  } catch (e) {
    console.log("Cannot load appearances proto file");
    throw e;
  }
  this.catalog = JSON.parse(fs.readFileSync('assets/catalog-content.json'));
  this.protoObject = this.protoRoot.lookupType("tibia.protobuf.appearances.Appearances");
  var assetFile = fs.readFileSync('assets/' + this.catalog[0].file);
  console.log(`>> Decoding ` + 'assets/' + this.catalog[0].file);
  this.data = this.protoObject.decode(assetFile);
  this.fileName = 'assets/' + this.catalog[0].file;
  this.loaded = true;
  return true;
}

Appearances.prototype.getItemById = function(itemId) {
  if (!this.loaded) {
    console.log("ERROR: Appearances are not loaded");
    return null;
  }
  var object = this.data.object.find(function (object) {
    return object.id == itemId;
  });
  if (object == undefined) {
    return null;
  } else {
    return object;
  }
}

Appearances.prototype.getAllItems = function () {
  if (!this.loaded) {
    console.log("ERROR: Appearances are not loaded");
    return null;
  }
  return this.data.object;
}

  Appearances.prototype.getOutfitById = function(outfitId) {
  if (!this.loaded) {
    console.log("ERROR: Appearances are not loaded");
    return null;
  }
  var object = this.data.outfit.find(function (object) {
    return object.id == outfitId;
  });
  if (object == undefined) {
    return null;
  } else {
    return object;
  }
}

Appearances.prototype.getAllOutfits = function () {
  if (!this.loaded) {
    console.log("ERROR: Appearances are not loaded");
    return null;
  }
  return this.data.outfit;
}

Appearances.prototype.save = function (fileName) {
  var saveFileName = fileName;
  if (!fileName) {
    saveFileName = this.fileName.slice(0, this.fileName.indexOf('.dat')) + "-edited.dat";
  }
  var buffer = this.protoObject.encode(this.data).finish();
  fs.writeFileSync(saveFileName, buffer, "binary");
}

module.exports = Appearances;

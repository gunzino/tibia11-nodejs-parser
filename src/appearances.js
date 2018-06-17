'use strict';

const ProtoBuf = require('protobufjs'),
  fs = require('fs');

function Appearances() {
  this.appearancesProto = '../assets/appearances.proto';
  this.loaded = false;
}


Appearances.prototype.loadFile = async function(fileName) {
  try {
    this.protoRoot = await ProtoBuf.load("./assets/appearances.proto");
  } catch (e) {
    console.log("Cannot load appearances proto file");
    throw e;
  }
  this.protoObject = this.protoRoot.lookupType("tibia.protobuf.appearances.Appearances");
  var assetFile = await fs.readFileSync(fileName);
  console.log(`>> Decoding ` + fileName);
  this.data = this.protoObject.decode(assetFile);
  this.fileName = fileName;
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

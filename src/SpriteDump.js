const fs = require('fs');
const lzma = require('./lib/lzma');
var lzmaNative = require('lzma-native');
const lzmaStream = require('./lib/lzma');
const Jimp = require("jimp");
var outStream = {
  data: [],
  offset: 0,
  // you only need either one
  writeByte: function(value) {
    this.data[this.offset++] = value;
  },
  // this is faster and preferred
  writeBytes: function(bytes) {
    this.data = this.data.concat(bytes);
    this.offset += bytes.length;
  }
};

function SpriteDump() {

}

SpriteDump.prototype.DecodeSpritesheet = async function(fileName) {
  console.log("Decoding " + fileName);
  var spriteFile = Buffer.from(fs.readFileSync('./assets/' + fileName + '.lzma'));
  var decoderPosition = 0;
  while (spriteFile.readUInt8(decoderPosition) == 0) {
    decoderPosition += 1;
  }
  decoderPosition += 4;

  while ((spriteFile.readUInt8(decoderPosition) & 0x80) == 0x80) {
    decoderPosition += 1;
  }

  decoderPosition += 3;

  var properties = spriteFile.readUInt8(decoderPosition);
  lc = properties % 9;
  properties = ~~(properties / 9);
  lp = properties % 5;
  pb = ~~(properties / 5);

  var dictionarySize = 0;

  dictionarySize = spriteFile.readUInt8(decoderPosition + 1);
  dictionarySize |= spriteFile.readUInt8(decoderPosition + 2) << 8;
  dictionarySize |= spriteFile.readUInt8(decoderPosition + 3) << 16;
  dictionarySize += spriteFile.readUInt8(decoderPosition + 4) * 16777216;

  var decoderProperties = spriteFile.slice(decoderPosition, decoderPosition + 5);
  decoderPosition += 5;

  decoderPosition += 0;


  var compressedSize = spriteFile.readUIntLE(decoderPosition, 8);
  decoderPosition += 8;
  var compressedData = spriteFile.slice(decoderPosition - 13);
  var decoderr = lzmaNative.createStream('rawDecoder', {filters : {
    lc : lc,
    lp : lp,
    pb : pb,
    dict_size : dictionarySize
  }});
  console.log(decoderr);

  var decoder = new lzma.Decoder();

  var properties = {
    data: [...decoderProperties],
    offset: 0,
    size: 5,
    readByte: function() {
      return this.data[this.offset++];
    }
  };

  var inStream = {
    data: [...compressedData],
    offset: 0,
    size : compressedData.length,
    readByte: function() {
      return this.data[this.offset++];
    }
  };

  var outStream = {
    data: [ /* Uncompressed data will be putted here */ ],
    offset: 0,
    size : 0,
    // you only need either one
    writeByte: function(value) {
      this.data[this.offset++] = value;
    },
    // this is faster and preferred
    writeBytes: function(bytes) {
      this.data = this.data.concat(bytes);
      this.offset += bytes.length;
    }
  };


  // lzma.decompress(properties, inStream, outStream, -1);
  // console.log(outStream.offset);
  // fs.writeFileSync('./decoded/' + fileName, outStream.data);

}

module.exports = SpriteDump;

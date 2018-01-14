'use strict';

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.thumbnailSize = function (originalImagePath, thumbnailImageLocation, callback) {
  _jimp2.default.read(originalImagePath, function (error, image) {
    if (error) {
      callback(new Error('Image has broken'), null, null);
    } else {
      image.resize(50, 50).write(thumbnailImageLocation, function (err) {
        if (err) {
          callback(err, null, null);
        }
        callback(null, thumbnailImageLocation, null);
      });
    }
  });
};
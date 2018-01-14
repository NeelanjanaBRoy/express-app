'use strict';

let _express = require('express');

let _express2 = _interopRequireDefault(_express);

let _jsonpatch = require('jsonpatch');

let _path = require('path');

let _fs = require('fs');

let _resize = require('../imgutils/resize.js');

let _jsonwebtoken = require('jsonwebtoken');

let _request = require('request');

let _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express2.default.Router();

/**
 * It authenticates json_patching and thumbnail_generation api
 * @name Api Authentications
 * @param {object} req contains headers
 * @param {object} res contains the decoded username and password
 * @param {function} next
 */

// ###################################################################################
//                           API VALIDATIONS
// ###################################################################################
router.use('/', function (req, res, next) {
  // decode token
  let token = req.headers.authorization;
  if (token) {
    // verifies secret and checks exp
    (0, _jsonwebtoken.verify)(token, 'anil', function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: 'Not authenticated' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// ################################################################################

//                          API FOR JSON_PATCHING

// ################################################################################

/**
 * Api to apply json patch on json object and Update json
 * @name Json-Patching
 * @param {object} req contains jsonObject and Patch
 * @param {object} res give patchedDocument op json
 * @param {function} next
 */

router.post('/patch', function (req, res, next) {
  if (typeof req.body.jsonObject === 'undefined') {
    res.statusCode = 400;
    res.json({ 'message': 'missing jsonObject' });
  } else if (typeof req.body.Patch === 'undefined') {
    res.statusCode = 400;
    res.json({ 'message': 'missing patch operations' });
  } else {
    let jsonObject = req.body.jsonObject;
    let operation = req.body.Patch;
    try {
      let patchDocument = (0, _jsonpatch.apply_patch)(jsonObject, operation);
      res.statusCode = 200;
      res.json({ patch: patchDocument });
    } catch (e) {
      res.statusCode = 400;
      res.json({ 'message': 'wrong patch operations' });
    }
  }
});

// ####################################################################################

//                    API FOR THUMBNAIL_GENERATIONS

// ####################################################################################
/**
 * Create thumbnail of image
 * @name Thumbnail-Generation
 * @param {object} req contains the url of image
 * @param {object} res gives the thumnail image of 50*50 size
 * @param {function} next
 */
//
router.post('/thumbnail', function (req, res, next) {
  if (typeof req.query.imageUrl !== 'undefined') {
    let imageUrl = req.query.imageUrl;
    _request2.default.head(imageUrl, function (err, response, body) {
      if (err) {
        next(err);
      } else {
        let contentType = response.headers['content-type'].substring(0, 5);
        let imgFormat = response.headers['content-type'].substring(6);
        let date = response.headers['date'].split(' ').join('_');
        if (response.statusCode === 200 && contentType === 'image') {
          if (response.headers['content-length'] <= 10 * 1024 * 1024) {
            let originalLocation = (0, _path.resolve)((0, _path.join)(baseDirectory, 'img')) + '/original_' + date + '.' + imgFormat;
            let thumbnailLocation = (0, _path.resolve)((0, _path.join)(baseDirectory, 'img')) + '/thumbnail_' + date + '.' + imgFormat;
            let stream = _request2.default.get(imageUrl).pipe((0, _fs.createWriteStream)(originalLocation));
            stream.on('finish', function () {
              (0, _resize.thumbnailSize)(originalLocation, thumbnailLocation, function (err, out) {
                if (err) {
                  next(err);
                } else {
                  res.writeHead(200, { 'content-type': response.headers['content-type'], 'Connection': 'close' });
                  res.end((0, _fs.readFileSync)(thumbnailLocation), 'binary');
                }
              });
            });
          } else {
            res.status(400);
            res.json({ message: 'image exceeds than 10 MB' });
          }
        } else {
          res.status(400);
          res.json({ message: 'image not found' });
        }
      }
    });
  } else {
    res.status(400);
    res.json({ message: 'url not found' });
  }
});

module.exports = router;
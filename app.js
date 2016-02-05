var express = require('express'),
  rp = require('request-promise'),
  cheerio = require('cheerio'),
  bluebird = require('bluebird'),
  querystring = require('querystring'),
  _ = require('underscore');

var Scraper = function(id){
  this.id = id;
  this.response = {};

  this.parse = function(data){
    console.info('Trying to parse', data.url);

    data.numComments = data.kids.length;
    data.timeStamp = Date(data.time).toLocaleString();

    var options = {
        uri: data.url,
        transform: function (body) {
            return cheerio.load(body);
        }
    },
    that = this;
    return rp(options)
      .then(function($){
        console.log('URL loaded', data.url);
        var photo, description;

        var photoMeta = $('meta[property="og:image"]') || $('meta[property="twitter:image:src"]') || null;
        if(photoMeta){
          photo = photoMeta.attr('content');        
        }

        var descriptionMeta = $('meta[name="description"]') || $('meta[name="Description"]') ||  $('meta[property="og:description"]') || null;
        if(descriptionMeta){
          description = descriptionMeta.attr('content');
        }
        _.extend(data, {
          photo: photo || null,
          description: description || null,
        });
        return data;
      }).
      catch(function(err){
        console.error('Could not parse', data.url);
        return data;
      });
  };

  this.fetchFromApi = function(callback){
    var that = this;
    var itemUrl = 'https://hacker-news.firebaseio.com/v0/item/{id}.json'.replace('{id}',this.id);
    console.log('Item url', itemUrl);
    rp({
        uri: itemUrl,
        strictSSL: false,
        json: true
      })
      .then(function(response){
        console.info('Item loaded');
        return response;
      })
      .then(that.parse)
      .then(function(data){
        that.response = data;
      })
      .catch(function(err){
        console.error(err);
      })
      .finally(function(){
        console.log(that);
        callback(that.response);
      });
  };  
};

var express = require('express');
var app = express();

app.get('/item/:itemid', function (req, res) {
  var s = new Scraper(req.params.itemid);
  s.fetchFromApi(function(data){
    res.status(200)
      .set({
        'Access-Control-Allow-Origin': '*' ,
        'Access-Control-Allow-Headers':'set-cookie, accept, method, content-type, x-requested-with',
        'Content-Type': 'application/json',
      })
      .send(data);
  });
});

app.listen(3033, function () {
  console.log('Example app listening on port 3033!');
});

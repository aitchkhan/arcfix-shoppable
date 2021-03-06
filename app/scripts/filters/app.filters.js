'use strict';

angular.module('shopthatvid')

.filter('removeSpaces', function() {
  return function(string) {
    return angular.isDefined(string) ? string.replace(/\s/g, '') : '';
  };
})
.filter('fromNow', function() {
  return function(string) {
    return angular.isDefined(string) ? moment(string).fromNow() : '';
  };
})
.filter('elipsis', function() {
  return function(string, count) {
    if (angular.isDefined(string)) {
      return string.length > count ? string.substring(0, count) + '...' : string;
    } else {
      return '';
    }
  };
})
.filter('ucFirst', function() {
  return function(string) {
    return angular.isDefined(string) ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };
})
.filter('linkify', function () {
  return function (text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, '<a href="$1" target="_blank">$1</a>');
  };
})
.filter('prependProtocol', function () {
  return function (link) {
    if(!link) {
      return '#';
    } else if(link.indexOf('http')<0){
      return 'http://'+ link;
    } else {
      return link;
    }
  };
})
.filter('htmlToPlaintext', function() {
  return function(text) {
    return String(text).replace(/<[^>]+>/gm, '');
  };
})
.filter('phoneNumber', function() {
  return function(str) {
    if(typeof str !== 'string'){ return ''; }

    //format number
    var rawNumber = str.replace(/[^0-9]/g,'');
    var regex = /^1?([2-9]..)([2-9]..)(....)$/;

    return rawNumber.replace(regex,'($1) $2 $3');
  };
})
.filter('decimal', function () {
    return function (input, places) {
      return !isNaN(input) ? parseFloat(input).toFixed(places) : input;
    };
  }
)
.filter('age', function(){
  return function(input, defaultText){
    defaultText = defaultText || 'Unknown';
    if(!input){return 'Unknown'; }
    else{
      var birthdate = new Date(input);
      var cur = new Date();
      var diff = cur-birthdate; // This is the difference in milliseconds
      return Math.floor(diff/31536000000); // Divide by 1000*60*60*24*365
    }
  };
})
.filter('checkNull', function () {
    return function (string, defaultText) {
      return string || defaultText;
    };
  }
)
.filter('rectangleThumb', function(){
  return function(url){
    return url || 'assets/images/blank_rectangle.png';
  };
})
.filter('squareThumb', function(){
  return function(url){
    return url || 'assets/images/blank_square.png';
  };
})
.filter('zeroleading', function () {
    return function (input) {
      var str = input.toString();
      if(str.length === 1){
        return '0' + str;
      }
      return str;
    };
})

.filter('productGroupImage', function($rootScope) {
  return function(productGroup) {
    // console.log('productGroup.productGroupImageUrl + $rootScope.shoppableVideoSAS: ', productGroup.productGroupImageUrl + $rootScope.shoppableVideoSAS);
    if(!productGroup) {
      return 'assets/content/products/group_01.png';
    }
    return productGroup.productGroupImageUrl + productGroup.productGroupImageSAS;
  };
})

.filter('productImage', function($rootScope) {
  return function(product) {
    if(!product) {
      return 'assets/content/products/group_02_shoes.png';
    }
    return product.productImageUrl + product.productImageSAS;
  };
})

.filter('toMinute', function () {
    return function (intTime) {
      var time = parseInt(intTime);
      var minute = parseInt(time/60);
      var second = parseInt(time%60);
      var str = '';
      str += minute.toString().length === 1 ? '0' + minute + ' : ' : minute + ' : '; 
      str += second.toString().length === 1 ? '0' + second : second;
      return str;
    };
});
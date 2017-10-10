var request = require('request');
var debug = require('debug')('dfunkt');

function zfingerParseUser(user) {
  return {
    fullname: user.cn,
    first_name: user.givenName,
    last_name: user.sn,
    kthid: user.uid,
    ugkthid: user.ugKthid,
  };
}

function httpsGet(url) {
  return new Promise( function(resolve, reject) {
    request.get(url, (error, response, body) => {
      if(error) {
        reject("error GETing from " + url + ": " + err);
      } else {
        resolve(body);
      }
    });
  });
}

function byKthid(kthid) {
  var url = 'https://zfinger.datasektionen.se/user/' + kthid;
  return httpsGet(url).then(function(response) {
    try {
      var resp = JSON.parse(response);
      return Promise.resolve(zfingerParseUser(resp));
    } catch (e) {
      return Promise.reject("No user found on zfinger with kthid " + kthid + ". Zfinger responded: " + recv_data);
    }
  });
}

function byUgkthid(ugkthid) {
  var url = 'https://zfinger.datasektionen.se/ugkthid/' + ugkthid;
  return httpsGet(url).then(function(response) {
    try {
      var resp = JSON.parse(response);
      return Promise.resolve(zfingerParseUser(resp));
    } catch (e) {
      return Promise.reject("No user found on zfinger with ugkthid " + ugkthid + ". Zfinger responded: " + recv_data);
    }
  });
}

function search(query) {
  var url = 'https://zfinger.datasektionen.se/users/' + encodeURIComponent(query);
  return httpsGet(url).then( function(response) {
    var results = JSON.parse(response);
    var results = results.map(zfingerParseUser);
    //TODO: maybe do something when we have more than 100 results.
    if (results.length > 100) {
      results = results.splice(0, 100);
    }
    return {results: results};
  });
}

module.exports = {
  byKthid,
  byUgkthid,
  search,
};

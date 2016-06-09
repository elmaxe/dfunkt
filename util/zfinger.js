var https = require('https');
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

function byKthid(kthid) {
  return new Promise(function(resolve, reject) {
    var url = 'https://zfinger.datasektionen.se/user/' + kthid;

    https.get(url, (get_res) => {
      recv_data = "";
      get_res.on('data', (d) => {
        recv_data += d;
      });
      
      get_res.on('end', () => {
        try {
          var resp = JSON.parse(recv_data);
          resolve(zfingerParseUser(resp));
        } catch (e) {
          reject("No user found on zfinger with kthid " + kthid + ". Zfinger responded: " + recv_data);
        }
      });
    }).on("error", function(err) {
      reject("Error searching zfinger: " + err);
    });
  });
}

function search(query) {
  return new Promise(function(resolve, reject) {
    var url = 'https://zfinger.datasektionen.se/users/' + encodeURIComponent(query);

    https.get(url, (get_res) => {
      recv_data = "";
      get_res.on('data', (d) => {
        recv_data += d;
      });
      
      get_res.on('end', () => {
        var resp = JSON.parse(recv_data);
        resolve({results: resp.results.map(zfingerParseUser)});
      });
    }).on("error", function(err) {
      reject(err);
    });
  });
}

module.exports = {
  byKthid,
  search,
};

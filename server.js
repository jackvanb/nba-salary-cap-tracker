//
// Simple Server
//
var http = require("http");
var path = require("path");

var express = require("express");

var options = {
  index: "home.html"
};

var router = express();
var server = http.createServer(router);

// ROUTES
// Serve Static Files
router.use(express.static(path.resolve(__dirname, "client"), options));

// AJAX Call for Salary Cap Info
router.get("/salary-cap-info", function(req, res) {
  res.send(JSON.stringify(map));
});

/* final catch-all route to home.html defined last */
router.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "home.html"));
});

server.listen(
  process.env.PORT || 3000,
  process.env.IP || "0.0.0.0",
  function() {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
  }
);

//////////////////////////
// Return Salary Cap Info
//////////////////////////
var map = {};
const rp = require("request-promise");
const cheerio = require("cheerio");

rp("https://www.spotrac.com/nba/cap/", function(error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    var cap = [];
    var names = [];

    // Get Salary Cap Value
    $(".center.result2").each(function() {
      cap.push($(this).text());
    });

    // Get Team Name
    $(".player.noborderleft").each(function() {
      names.push($(this).text());
    });

    for (var i = 0; i < names.length; i++) {
      map[names[i]] = cap[i];
    }
    // Log our finished parse results in the terminal
    console.log(map);
  } else {
    console.log(error);
  }
});

const express = require("express");
const app = express();
const path = require("path");

app.use("/", express.static(__dirname + "/dist"));
app.use("/hci-ng-grid-demo/", express.static(__dirname + "/dist"));

app.listen(process.env.PORT || 3000);

app.get("/hci-ng-grid-demo/*", function(req, res) {
    res.sendFile(path.join(__dirname + "/dist/index.html"));
});

const express = require("express");
const cors = require('cors')
const app = express();
const port = 3000;

const path = require("path");

const frontendPath = path.join(__dirname, "frontend");
const adminPath = path.join(__dirname, "frontend", "admin");
const devPath = path.join(__dirname, "frontend", "admin", "0000-dev");
// const devPath =  + "/frontend/admin";
// const adminPath = __dirname + "/frontend/admin";

app.use(cors());

app.use(express.static(frontendPath));
// app.use(express.static(adminPath));
app.use(express.static(devPath));
// app.use(express.static(frontendPath + "/assets"));
// app.use(express.static(adminPath));

app.get("/admin", (req, res)=>{
  res.sendFile(adminPath + "/index.html");
});

app.listen(port, ()=>{
  console.log("listening on localhost:" + port);
});

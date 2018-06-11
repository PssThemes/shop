const express = require("express");
const app = express();
const port = 3000;

const frontendPath = __dirname + "/frontend";
const adminPath = __dirname + "/frontend/admin";

app.use(express.static(frontendPath));
// app.use(express.static(frontendPath + "/assets"));
// app.use(express.static(adminPath));

app.get("/admin", (req, res)=>{
  res.sendFile(adminPath + "/index.html");
});

app.listen(port, ()=>{
  console.log("listening on localhost:" + port);
});

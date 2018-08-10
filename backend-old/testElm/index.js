const Elm = require("./TestElm.js");
const express = require("express");
const app = express();


app.get("/", (req, res) => {

  const elmApp = Elm.TestElm.worker();

  elmApp.ports.start.send(null);
  elmApp.ports.finish.subscribe(() => {
    res.send("ok da da ");
  });

});


app.listen(3000, () =>  {
  console.log("listening on port 8080");
});

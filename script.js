const express = require("express"); //Import Express
const Joi = require("joi"); //Import Joi
const app = express(); //Create Express Application on the app variable
app.use(express.json()); //used the json file
const fs = require("fs");

//Give data to the server
const rawdata = fs.readFileSync("./equipment.json");
let equipment = JSON.parse(rawdata);
console.log(equipment);

//Read Request Handlers
// Display the Message when the URL consist of '/'
app.get("/", (req, res) => {
  res.send("Welcome to Zvinhu zviedzwa REST API!");
});
// Display the List Of Equipment when URL consists of api equipment
app.get("/api/equipment", (req, res) => {
  res.send(equipment);
});
// Display the Information Of Specific equip when you mention the id.
app.get("/api/equipment/:id", (req, res) => {
  const equip = equipment.find((c) => c.id === parseInt(req.params.id));
  //If there is no valid equip ID, then display an error with the following message
  if (!equip)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  res.send(equip);
});

//CREATE Request Handler
//CREATE New equip Information
app.post("/api/equipment", (req, res) => {
  const { error } = validateEquip(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //Increment the equip id
  const equip = {
    id: equipment.length + 1,
    equip: req.body.equip,
    watts: req.body.watts,
    on: req.body.on,
  };
  equipment.push(equip);
  let saveData = JSON.stringify(equipment, null, 2);
  fs.writeFile("./equipment.json", saveData, (err) => {
    if (err) throw err;
    console.log("task done");
  });
  res.send(equip);
});

//Update Request Handler
// Update Existing equip Information
app.put("/api/equipment/:id", (req, res) => {
  const equip = equipment.find((c) => c.id === parseInt(req.params.id));
  if (!equip)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>'
      );

  const { error } = validateEquip(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  equip.equip = req.body.equip;
  equip.watts = req.body.watts;
  equip.on = req.body.on;
  res.send(equip);
});

//Delete Request Handler
// Delete equip Details
app.delete("/api/equipment/:id", (req, res) => {
  const equip = equipment.find((c) => c.id === parseInt(req.params.id));
  if (!equip)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>'
      );

  const index = equipment.indexOf(equip);
  equipment.splice(index, 1);

  res.send(equip);
});
//Validate Information
function validateEquip(equip) {
  const schema = {
    equip: Joi.string().min(3).required(),
    watts: Joi.number().integer().required(),
    on: Joi.boolean().required(),
  };
  return Joi.validate(equip, schema);
}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

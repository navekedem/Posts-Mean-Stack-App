const express = require("express");
const app = express();
const body = require("body-parser");
const postsRoutes = require('./Routes/postsRoutes');
const authRoutes = require('./Routes/auth');
const mongoose = require('mongoose');
const path = require('path')

mongoose.connect("mongodb+srv://Nave:8wmZa4Fpoqx08MWe@navek-vjwuz.mongodb.net/test?retryWrites=true" ,{ useNewUrlParser: true }).then(()=>{
  console.log("DataBase Is Connected");
}).catch(()=>{
  console.log("DataBase Connection failed");
});


app.use(body.json());
app.use(body.urlencoded({extended : false}));
app.use('/images', express.static(path.join("backend/images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/posts" , postsRoutes);
app.use("/api/user" , authRoutes);


module.exports = app;

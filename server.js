const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
var winston = require('./app/config/winston');
app.use(morgan('combined', { stream: winston.stream }));
const db = require("./app/models");
db.sequelize.sync(); 
global.__basedir = __dirname+"/app";
global.__baseurl = "http://localhost:8080"
const leadRoute = require('./app/routes/leads.route');
const logger = require("./app/config/winston");
app.use('/api/leads', leadRoute);
app.get('/',(req,res)=>{
  res.send("Hello ! Hello ! Checking Checking.............");
})

const PORT = process.env.PORT||8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});


const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync(); 
global.__basedir = __dirname+"/app";
global.__baseurl = "http://localhost:8080"
// process.on('unhandledRejection', function(err) {
//   console.log(err);
// });

const leadRoute = require('./app/routes/leads.route')
app.use('/api/leads', leadRoute);


app.get('/',(req,res)=>{
  res.send("Hello");
})

const PORT = process.env.PORT||8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
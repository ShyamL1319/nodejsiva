const db = require("../models");
const fs = require("fs");
const csv = require("fast-csv");
const { Parser } = require('json2csv');
const logger = require("../config/winston");
const Leads = db.leads;
const Op = db.Sequelize.Op;
const getPagingData = (data, page, limit) => {
    const { count: leadsCount, rows: leadsData } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(leadsCount / limit);
    return { leadsCount, leadsData, totalPages, currentPage };
  };

const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page-1 ? page * limit : 0;
  
    return { limit, offset };
  };
const  isEmailUnique = async (email)=> {
    const count = await Leads.count({ where: { email: email } })
        if (count != 0) {
          logger.log(count);
          return false;
        }
        return true;
}
// const jsontocsv = async (duplicates)=>{
//   var fields = ['id','title','firstName','lastName','email','assignee','leadStatus','leadSource','leadRating','phone','companyName','industry','adressLine1','adressLine2','city','state','country','zipcode','createdAt','createdAt'];
//   var csv =  json2csv.parse({ data: duplicates, fields: fields });
//   var filename = 'duplicates'+Date.now()+'.csv';
//   var path = __basedir+'/assets/reports/'+filename;
//   logger.log("file path jsontocsv",path)
//    fs.writeFile(path, csv, function(err,data) {
//     if (err) {throw err;}
//     else{ 
//       logger.log('file saved path generated') // This is what you need
//       return filename;
//     }
//   }); 
// }
const leadController = {
    add : async (req, res) => {
        const reqData = req.body;
        const {email} = reqData;
          try {
          
            const data = await Leads.findOne({where:{email}}); 
            logger.info(data); 
            if(data){
              logger.warn("Conflicting data .....!")
              res.status(409).json({msg:"conflict already exist with this email"});

            }
          }catch (error) {
            logger.log(error);
            res.status(404).send({msg :error});
          }
        Leads.create(reqData)
             .then((data)=>{
              logger.info("saved successfully");
              res.status(201).json({msg:"saved successfully",data})

             })
             .catch((err)=>{
               logger.log("err : " +  err.message);
               res.status(500).send("Internal server error");
             });
    },
    getData : (req, res) => {
        const id = req.params.id;
        if(!id){
          logger.info("Id entered does not exist")
          res.status(401).send({message:"Please enter valid id"});

        }
        Leads.findOne({where:  {id}})
          .then(data =>{
            if(!data){
              logger.info("Wrong Id entered does not exist")
              res.status(404).send({msg:"No data available"});
            }
            logger.info("data recieved successfully "+data)
            res.status(201).json({msg:"data recieved successfully",data});

          }).catch(err => {
            logger.log("Some error occurred while retrieving"+ err.message)
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving"
            });
            
        });
    },
    getAll: (req,res)=>{
        const { page, size, title } = req.query;
        var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        const { limit, offset } = getPagination(page, size);
        Leads.findAndCountAll({ where: condition? condition:"", limit, offset })
            .then(data => {         
                const lData = getPagingData(data, page, limit);
                res.status(201).json(lData);
                logger.info("data recieved successfully "+data)
                })
                .catch(err => {
                logger.log("Some error occurred while retrieving")
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while retrieving Leads."
                });
                
       });
    },
    upload : (req, res) => {
          var duplicates = [];
          let leads = [];
          var err;
          try  {
            if (req.file == undefined) {
              logger.log("No file attached please select a file")
              return res.status(400).send("Please upload a CSV file!");
            }
            let path = __basedir + "/assets/uploads/" + req.file.filename;
            
            fs.createReadStream(path)
              .pipe(csv.parse({ headers: true }))
              .on("error", (error) => {
                logger.log("Unable to save file :"+error.message)
                throw error.message;
                
              })
              .on("data", (row) => {                  
                leads.push(row);
              })
              .on("end",() => {
                logger.info("data read successfully now updating in data base");
                var emails = leads.map(obj => ({email:obj.email}));
                Leads.findAndCountAll({
                  where:{
                    [Op.or]:emails
                  }
                }).then((result)=>{
                logger.info(result);
                duplicates = result.rows.map((data)=> data.dataValues);
                if(duplicates.length == 0 || duplicates.length != leads.length){
                  Leads.bulkCreate(leads,{ignoreDuplicates: true}).then((result)=>{
                    if(duplicates.length === 0){
                      logger.info("data read successfully now updated  in database No duplicate were there");
                      res.status(201).send({
                        message:
                          "Uploaded successfully All data from" + req.file.originalname,
                          data:result
                      });
                    }else{
                      logger.info("data read successfully now updated  in database and duplicate were there also");
                      logger.log(duplicates);
                      var fields = ['id','title','firstName','lastName','email','assignee','leadStatus','leadSource','leadRating','phone','companyName','industry','adressLine1','adressLine2','city','state','country','zipcode','createdAt','createdAt'];
                      const parser = new Parser({fields});
                      var csv =  parser.parse(duplicates);
                      var filename = 'duplicates'+Date.now()+'.csv';
                      var path = __basedir+'/assets/reports/'+filename;
                      logger.log("file path jsontocsv",path)
                       fs.writeFile(path, csv, function(err,data) {
                        if (err) {throw err;}
                        else{ 
                          logger.log('file saved path generated') // This is what you need
                        }
                      }); 
                      logger.info("data generated and send the path to client")
                      res.status(409).json({
                        message:
                        `Partialy  data saved  duplicate are here `,
                        "created": result.length,
                        "duplicates": duplicates.length,
                        "error": err==undefined?0:err,
                        "report": `${__baseurl}/api/leads/download/${filename}`
                      });
                    }
                 });                   
                }else{
                  logger.log(duplicates);
                  var fields = ['id','title','firstName','lastName','email','assignee','leadStatus','leadSource','leadRating','phone','companyName','industry','adressLine1','adressLine2','city','state','country','zipcode','createdAt','createdAt'];
                  const parser = new Parser({fields});
                  var csv =  parser.parse(duplicates);
                  var filename = 'duplicates'+Date.now()+'.csv';
                  var path = __basedir+'/assets/reports/'+filename;
                  logger.log("file path jsontocsv",path)
                   fs.writeFile(path, csv, function(err,data) {
                    if (err) {throw err;}
                    else{ 
                      logger.log('file saved path generated') // This is what you need
                    }
                  }); 
                  logger.info("data read successfully All data were duplicate so no change in database");
                  res.status(409).json({
                     message:
                     `All  data are  duplicate No data saved `,
                     "created": result.length,
                     "duplicates": duplicates.length,
                     "error": err==undefined?0:err,
                     "report": `${__baseurl}/api/leads/download/${filename}`
                  });
                }
              }).catch(err =>{
                logger.log("Internal Server Error " +err.message);
                res.status(500).json({
                  message:
                  `Internal server issue ${err} `,
               });
              });
            });
          } catch (error) {
            logger.log(error);
            res.status(500).json({
              message:
              `Internal server issue ${error} `,
           });
        }
    },
    update: (req,res)=>{
          const id = req.params.id;
          if(!id){
            logger.log("Invalid entered");
            res.status(401).send({message:"Please enter valid id"})
          }
          Leads.findOne({where: {id}})
                .then(record => {

                  if (!record) {
                    logger.log("No record found with this id:"+id);
                    throw new Error('No record found')
                  }

                  logger.info(`retrieved record ${JSON.stringify(record,null,2)}`) 
                  let reqData = req.body;
                  record.update(reqData).then( updatedRecord => {
                    logger.info(`updated record ${JSON.stringify(updatedRecord,null,2)}`)
                    res.status(201).json({msg:"successfully updated",data:updatedRecord});
                  })
                })
                .catch((error) => {
                  logger.log("Internal Server Error " +error.message);
                  res.status(500).send({msg:"Internal Server Error"+error.message});
                  throw new Error(error)
                });
    },
    bupdate:(req,res)=>{
              const ids = req.body.ids;
              const data = req.body.data
              Leads.update(data,
                {where: {
                    id: ids
                  }},
              ).then((result)=>{
                   logger.log(result);
                   res.status(201).send({msg:"successfully updated",data:result});
              }).catch((err)=>{
                    logger.log("Internal Server Error " +err.message);
                    res.status(500).send({msg:"Internal Server Error"+err.message});
                    throw new Error(err);
              });
    },
    delete : (req,res)=>{
            const id = req.params.id;
            if(!id){
              logger.log("Id is empty please add valid id : "+id);
              res.status(401).send({message:"Please enter valid id"})
            }
            Leads.destroy({
              where: {id}
            }).then(result => {
              logger.info("succssfull deleted data related with id : "+id);
              res.status(201).send({msg:`succssfull deleted data`});
            }).catch(error => {
              logger.log("Internal Server error : "+id);
              res.status(500).send({msg:`Internal Server error`});
            });
    },
    download:(req,res)=>{
     var fname =req.params.filename;
     var path = __basedir+"/assets/reports/"+fname; 
     logger.log(" downloaded file duplicates",path)
     res.set('Content-Type', 'text/csv');
     res.status(201).download(path);
    },
}
module.exports = leadController
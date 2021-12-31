module.exports = (sequelize, Sequelize)=>{
    const Leads = sequelize.define("crmleads", {
      id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type : Sequelize.STRING
      },
      firstName: {
        type : Sequelize.STRING
      },
      lastName: {
        type : Sequelize.STRING
      },
      email: {
        type : Sequelize.STRING
      },
      assignee:{
        type : Sequelize.STRING
      },
      leadStatus: {
        type : Sequelize.STRING
      },
      leadSource: {
        type : Sequelize.STRING
      },
      leadRating: {
        type : Sequelize.INTEGER
      },
      phone: {
        type : Sequelize.STRING
      }, 
      companyName: {
        type : Sequelize.STRING
      },
      industry: {
        type : Sequelize.STRING
      },
      adressLine1: {
        type : Sequelize.STRING
      },
      adressLine2: {
        type : Sequelize.STRING
      },
      city: {
        type : Sequelize.STRING
      },
      state: {
        type : Sequelize.STRING
      },
      country: {
        type : Sequelize.STRING
      },
      zipcode: {
        type : Sequelize.STRING
      },
    });
  return Leads;
};
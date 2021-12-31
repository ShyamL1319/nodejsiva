# NodeJs Application

Node Js Project
Recently I have started working on a new project and the issue that I faced was spending a lot of time building the project structure based on the best practices, especially with javascript that has a lot of approaches and bad parts, I couldn't find any place that wraps the best practices into a single project ,so I decided to make it on my own.

In this repository, I don't aim to provide an optimal solution as each project have its own necessity but to help anyone that is starting with a node js project and can't find any inspiration on how to start building the project to take this project as the starting point.

Some of the good practices followed in this repository:

# Async/Await support
# Error Handling
# Sequelize Support
# Key technology used Nodjs, Express, Sequelize ORM ,PostgresSql DB,multer
Enviroment variables to hold configuration values .env file
i've followed airbnb Coding standard with a eslint ,help to keep thing into prespective.
How to start the project
First you clone the project using the following command :

# git clone https://github.com/shyamlal98/nodejsiva.git

install node version 16.3.0 or use nvm to downgrade your node version

Delete the existing package.lock.json and run npm install
Now all dependencies will be installed 
Then you create a postgres database named crmleads with the following credintials
port : 5432
host : localhost
username : postgres
password : postgres

You don't to create a table seperately it will automaticaly create the table

Finally you run npm start

now try to access the end points





`GET /leads` - Returns a list of `Lead` objects in the database, paginated. The query params for pagination can be of your choice.

`GET /leads/{id}` - Returns a `Lead` object with the specific lead id supplied as path param.

`POST /leads` - Send a JSON request body for lead creation with `Lead` objects. Returns status `201 created` on successful creation, or status `409 conflict` on duplication.

`POST /leads/bulk` - Send a CSV file as request body with `Lead` objects. Returns a JSON object with the stats of the bulk upload, e.g.

```json
{
	"created": 230,
	"duplicates": 46,
	"error": 12,
	"report": "{base_url}/reports/{uuid}"
}
```

The `report` key contains a link which can be used to download a `CSV` which contains all the error and duplicated records, so that the user can easily modify, fix and upload it back quickly.

This is the most important endpoint and it should be built very well, with duplication management and error handling for malformed data.

`PATCH /leads/{id}` - For updating any field of a particular `Lead` object.

`PATCH /leads/bulk` - For updating any field of a list of `Lead` objects, defined by the `id` field in the request body. The `id` field should be an array of `Lead` object ids.

`DELETE /leads/{id}` - Delete a particular lead.

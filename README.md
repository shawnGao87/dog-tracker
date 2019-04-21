## Instructions

#### App is built with Node / Express with Body-Parser. There's also a front-end app built with React for the convenience of testing.

1. git clone https://github.com/shawnGao87/dog-tracker.git (I included all node_modules so you won't have to download the entire Internet by doing npm install ...)
2. CD into the repo folder.
3. `npm start` Server will start at port 5000.
4. (optional) to run the front-end `cd client && npm start`. It will start at port 3000.

## End Points

GET /dogs - List all dogs
POST /dogs - Add a new dog
GET /dogs/:id - Get details for one dog
PUT /dogs/:id - Update details for one dog
DELETE /dogs/:id - Remove a dog

e.g. http://localhost:5000/dogs to get all dogs

Here, assuming the id parameter is an integer.

I didn't add any data / form / request validation on neither back- nor front-end. i.e. You can totally submit an empty form on the front-end and the API will take it.

An ORM would make things a whole lot easier dealing with a real database.

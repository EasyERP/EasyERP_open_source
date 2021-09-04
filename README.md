## How to start

Open tinyERP.zip with any IDE

Use node version 16.5.0(8.12.0) to build the project.
Run commands 'npm i' & 'npm run build' in terminal. 

As result, you'll get all modules and webpack will build the client side js bundle

## Now let's move to DB

You'll need to do mongorestore. For this, please unpack dump.zip and run mongorestore in the same directory, where the dump folder appears
`mongorestore ./dump`

Using mongo and redis docker for demo would be easier. and mongoretore is preinstalled in the mongo docker image.

This action provides you with our 2 test DBs

One of them is empty (called saas), so you can fulfil it manually

Second one (called CRM) contains data

Please make sure that port 8089 in your localhost is free

Next you should run the project in your IDE

Open localhost:8089 in browser

Choose the db and enter login and pass

Login to databases CRM and saas is "superAdmin". Password is "111111"

## How to start

Please make sure to have installed nodejs starting from 4.0 and mongodb starting from 3.0 and latest version of redis-server 

Open EasyERP.zip with any IDE

Please install bower globally (type in 'npm install bower -g' in terminal)

Run commands 'npm i' & 'bower i' in terminal

As result, you'll get all modules

## Now let's move to DB

You'll need to do mongorestore. For this, please unpack dump.zip and run mongorestore in the same directory, where the dump folder appears

This action provides you with our 2 test DBs

One of them is empty (called saas), so you can fulfil it manually

Second one (called CRM) contains data

Please make sure that port 8089 in your localhost is free

Next you should run the project in your IDE

Open localhost:8089 in browser

Choose the db and enter login and pass

Login to databases CRM and saas is "superAdmin". Password is "111111"
Tutorial Cake-Tracker:

Make sure you have mongodb,and node.js installed. if you dont you can install them from here:

https://www.mongodb.com/try/download/community
https://nodejs.org/en/download/package-manager

After you installed it you have to open a terminal and run this command:

npm init -y
npm install mongoose

After the installation is complete try to run:

mongod --version

If the command is not recognised you will have to add it to your environment variables.
The adress should look something like this:"C:\Program Files\MongoDB\Server\7.0\bin"

Once you can run the mongod --version command. You want to open your MongoDbCompass and establish a connection to this URI
mongodb://localhost:27017
Once you've established the connection you want to create a new Database and call it "Datavid" and the collection will be named "employees"
If you've created your database you can hop on to another terminal. You're gonna want to run this command so that whatever process is currently on by node on your device will be 

turned off:
taskkill /F /IM node.exe

After you've stopped the running processess just move to your folder adress in the terminal. You can do that by using the command:

cd [datavid-cake-tracker adress]

Make sure to replace [datavid-cake-tracker adress] with the actual adress. For me it looks like this:

C:\Users\narci>cd C:\Users\narci\OneDrive\Desktop\DataVid\datavid-cake-tracker

After you're in the target directory just run the command:

npm start

If you've done the steps the right way you should recieve this messages:
Server is running on http://localhost:3000
MongoDB connected

Once the server is running and the database is connected all you have to do is to open a browser to your liking, I usually use Opera so I can guide you better if you use Opera as well.
In your browser access this web adress:

http://localhost:3000

It will take you to the front page of the application. And you will have the Datavid logo the application name two buttons one to confirm your status as admin or one to see all the Datavid
employees that are currently existing in Database. Spoiler, you have none at the moment. But don't worry, an entrusted person can add them any time. You will also see that you have a message
"No employee was born today :(", welp you have no employees for no so it's not much of a surprise.
However you can also confirm your status as an admin and begin adding your employees.
If you click on the confirm admin status button, you will have to enter a password. The password is:

MilkyWay

Once you've confirmed that you are indeed an admin you can begin adding employees to the database by pressing the add employee button.
The button will open a form that will let you introduce the data about ur employees, their first name, last name, country, city in which they live, and their birthdate.
However, if you try to hire somebody that isn't over 18 years of age. You should encounter an alert that will tell you there was an error and to try again later, moreover, if you press
ctrl+shift+j you will access the console logs in which you will see the error message:"Employee must be at least 18 years old.". Also if for example you want to add somebody that has
already been added before for example you want to add Alex Pascu from Cluj, Romania born on 10-10-2000 but there already exists an Alex Pascu from Cluj, Romania that was born on a different
day you won't be allowed. Although, there is a chance that two employees that work for Datavid have the same name, they would most probably not live in the same city.
But if you try and add a unique employee you will recieve an alert stating "Employee added successfully". Once you've done that you have the option to add as many employees as you want and
when you're ready you can click on the Show all employees button wich will let you see all of your employees and their information. You also have a Filter by closest birthday button which
you may have guessed sorts the employees based on whose birthday is the closest to the present.
If you close this form you will notice that either a message that states somone's birthday is today or a countdown on when the next birthday is going to be so you don't forget.
In order to get rid of your employees you have to be logged in as the admin and click the Delete button next to them in the employees list.

P.S. I didn't see the need to add an Update endpoint for the API, because in this version there isn't anything that the good ol' Delete-Add Employee combo can't do.
Also in order to remove your admin status / just refresh the page and it will automatically set to false. I also left some comments in the frontend script so it is easier to navigate
through and understand.

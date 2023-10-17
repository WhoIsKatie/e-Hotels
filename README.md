# e-Hotels
e-Hotels was implemented using a combination of PostgreSQL, Express.js, React.js, and Node.js. 

The database management system was built upon PostgreSQL due to its robustness and reliability in handling large amounts of data writes. Inserting data for five hotel chains quickly scaled to amass over 200 rows of data for hotel rooms, not considering the many bookings each room would generate in a real-world context.

For backend and server-side logic and routing, the Express framework allowed for the design of the RESTful API to handle HTTP requests and responses. Each transaction between the server and client prompts the application to connect and query to the database.

Similarly, Node provided the runtime environment necessary for the execution of the application.

Together, these technologies enabled the development of a web-based hotel management system application with the potential to handle complex logic and interactions.


## Installation
#### Step 1: Install PostgreSQL and Node.js
Download and install PostgreSQL and Node.js from their official websites.
It is critical to ensure that the installed programs have been added to the system’s PATH by checking environmental variables.
#### Step 2: Download Application
Download the .zip folder containing the application files and navigate to the desired directory to extract.
#### Step 3: Install Dependencies
In the root directory of the application, run the command ‘npm install’ in order to install the dependencies required by the application.
#### Step 4: Create the PostgreSQL Database
In the terminal, open PostgreSQL by running the command `psql -U postgres`.
To create and host the database, use the command `CREATE DATABASE e-Hotels;` and set the password as ‘admin’.
To exit psql, run the command `\q`.
#### Step 5: Start the Application
In the root directory of the application, run the command `npm start` to start the application.

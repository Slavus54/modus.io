### Modus.io

### Description

Platform to create sense of living and being an individual person  

### Stack

Web app on **React** + **TS**, state management with **Context API** and **Redux Toolkit**, persist data in cookie.  

Testing with Jest

### Architecture

Inside *src* you can see many folders.  

Core of App based on Layout with routing-access-level system, checking every route for client.  

Home page divided on 2 components, *static welcome page* and *account page*  

Account Page has own sidebar with microserveces interacting with profile. (Personal info, geo, some collections and etc.)    

Every *hoc component* created with schema:  

Form in profile page  
Search page  
Single item page  

### What about functional?  
  
Inside profile page you can see all components you working with, create and using *hoc components*    

Also, there you can manage own Marathon Distance (part using Redux)     

### Demo URL and Download  

Look on https://658fcf952414b2450923f7e8--modus-vivendi.netlify.app      

Fork and clone this repository  

~~~
git clone https://github.com/Slavus54/modus.io.git  
npm run start
~~~

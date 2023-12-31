## Modus.io

### Description

Platform to create sense of living and being an individual person  
Interface in russian language.

### Stack

Web app on **React** + **TS**, state management with **Context API** and **Redux Toolkit**, persist data in cookie.  

Rounting on **Wouter**.  

**GraphQL** with **Apollo** allow to use great API to work with backend.  

Unit testing with **Jest**.  

Date management and different-scope functions with own libraries **centum.js** and **datus.js**.  

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

https://6590f08f929bead91685f745--modus-vivendi.netlify.app      

Fork and clone this repository  

~~~
git clone https://github.com/Slavus54/modus.io.git  
npm run start
~~~

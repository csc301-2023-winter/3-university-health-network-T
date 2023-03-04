## Summary of Our Software

We are going to build a responsive website for stroke and cardiovascular patients to do rehabilitation exercises remotely. This website will be suitable for both mobile and PC users. This website is going to create a friendly and efficient communication platform for physicians and patients. 
we are going to make the following activities happen through this webste: 

* physicians can view the progress of the patients. Patients are able to watch rehabilitation video exercises
* physicans can record their movement video on the websites.
* physicians can comment on the patients’ movement and set up the next set of rehabilitation exercises. 
* Patients are able to schedule online video meetings to communicate with physicians. 

This website is going to overcome the location barriers for patients that live far from the rehabilitation stations, as well as to overcome the mobility barriers for patients that contain mobility issues with their body after strokes. 

There is no existing software. 

## Decision on dividing the project

-Tasks Done in  Week 1 and Week 2: 

Define the requirements:  Before starting the development process, We define the requirements of the virtual rehabilitation website. This includes understanding the target audience, identifying the key features, and defining the user interface.

Design the user interface: We discuss the design of the user interface with the UHN partner and finalize the design with the pencil drawing of the rehabilitation patient panel. 
The link below is the website interface design: 
https://docs.google.com/file/d/1ZQs1WJQga5S0sfwDF31e4Du5orOlK7pf/edit?usp=docslist_api&filetype=mspresentation

Set up the development environment: After designing the user interface, We will set up the development environment. This involves installing the necessary software and tools, including Node.js, React, SQL Server, and Azure.

-Plans for the Following Weeks: 

Implement the back-end: The next step is to implement the back-end using Node.js. This involves creating the API endpoints and connecting to the SQL database with patient info, meeting time, and exercise lists. We will use libraries like Express.js to simplify the development process. We will prioritize the meeting page and the exercise/home page for the patient panel. The two pages involve several important features such as: real-time video conferencing, video recording, user’s exercise list, and blog posts rendering. Thus, we will utilize additional tools such as: Socket.IO, WebRTC, and PeerJS. 

Develop the front-end:  we will develop the front-end using React. This involves implementing the user interface, integrating with the back-end API, and adding any necessary functionality. Similar to the back-end development, we will focus on the patient interface panel including the exercise/home page and meeting page. We will put a lot of effort on the menu bar because this will be the key feature for most of the pages in this website. We will use modern web technology including: HTML, CSS, JavaScript. In addition, we will use some popular front-end frameworks including React and Bootstrap. Since the exercise/home page and meeting page has multi-components in, we will also use Next.js.

Test the website: After completing the development process, we will  test the website thoroughly. This involves checking for bugs, errors, and other issues that may affect the functionality or performance of the site. We will use tools like Jest and Enzyme for testing the front-end and tools like Postman for testing the back-end.

Deploy the website to Azure: Once the website is fully tested, we can deploy it to Azure. This involves creating an Azure account, setting up the necessary resources, and deploying the website using tools like Azure DevOps.

Maintain and update the website: Finally, you need to maintain and update the website on an ongoing basis. This involves monitoring the performance of the website, fixing any bugs or issues that arise, and updating the website with new features and functionality as needed.

Overall, developing a virtual rehabilitation website with React as front-end, Node.js as backend, SQL as a database, and Azure as cloud requires careful planning, implementation, and testing to ensure a successful launch and ongoing maintenance.


## Responsibility on each sub teams

    - Team 1(responsible for UI)
        creating the UI for home page and the recording page which comes with the 3D avatar, including 
        the basic redirecting in between these two pages. If time allows, complete the login and register
        for new account page with the same requirements above.
        
        the final outcomes should include some basic logic that does not involve anything that needs the 
        backend, for example, menu pop ups, page routing, as well as start and stop recording videos 
        (without saving them to the backend)
        

    - Team 2(backend)
        We design the backend for a web application,with a focus on four important pages: Meeting, Exercise, 
        Home Pop-up and Blog. The design decisions and tools used, such as Socket.IO, Express, WebRTC, PeerJS,
        and Node.js, are explained. The backend design includes features such as real-time video conferencing, 
        recording, blog posts rendering, and serving static HTML for the user's to-do list. Since the database 
        is not connected, many parts that would normally require a database connection have been replaced by a 
        combination of local lists and dictionaries or by sending a response as a signal.
        
     - Team 3(database and deploy to Azure)
        Creating a schema to record the patient’s exercise progress information by postgreSQL. 
        Implementing the UI interfaces to visualize the exercise progress information on Azure. 


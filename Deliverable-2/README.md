# Virtural Rehabilitation/TEAM 3
​
> _Note:_ This document is intended to be relatively short. Be concise and precise. Assume the reader has no prior knowledge of your application and is non-technical. 
​
## Description 
- Context:

This is  a responsive website for stroke and cardiovascular patients to do rehabilitation exercises remotely. The application can arrange weekly and daily exercise programs for users, and users can turn on the camera and synchronize training with avatar exercise videos.
- Value behind the application:

This website is going to overcome the location barriers for patients that live far from the rehabilitation stations, as well as to overcome the mobility barriers for patients that contain mobility issues with their body after strokes.
​
## Key Features
 * Patients are able to do daily rehabilitation exercises viturally. 
    * Patients can login their account to see their assinged exercises
    * Patients can choose the avatar gender to do the exercises.
 * Patients are able to record their own exercising videos.
    * Patients can press the record button to do the redording.
 * Patients are able to do online consultation with physicians. 
    * Patients can find their appointments on the calender 
    * Patients can set up their microphone, speaker and camera 
    * Patents can do the meeting with the doctor.
 * Describe the key features in the application that the user can access.
 * Provide a breakdown or detail for each feature.
 * This section will be used to assess the value of the features built
​
## Instructions
   * Login 

   * Home Pop-up 

   * Home/Exercise 

   * Menu

   * Rehab program 

   * Blog 

   * Settings 

   * Contact Us 

   * Meetings

 * Clear instructions for how to use the application from the end-user's perspective
 * How do you access it? For example: Are accounts pre-created or does a user register? Where do you start? etc. 
 * Provide clear steps for using each feature described in the previous section.
 * This section is critical to testing your application and must be done carefully and thoughtfully.
 
 ## Development requirements
 * What are the technical requirements for a developer to set up on their machine or server (e.g. OS, libraries, etc.)?
 * Briefly describe instructions for setting up and running the application. You should address this part like how one would expect a README doc of real-world deployed application would be.
 * You can see this [example](https://github.com/alichtman/shallow-backup#readme) to get started.
 
 ## Deployment and Github Workflow
​
Describe your Git/GitHub workflow. Essentially, we want to understand how your team members share codebase, avoid conflicts and deploys the application.
​

We choose to use  Model-View-Presenter (MVP) to create this virtual rehabilitation website project, we follow the following steps:

* Model: Identify the data and business logic that the website needs to support the virtual rehabilitation program. We need to store user profiles, exercise programs, and progress reports. We create a data model that represents these entities and provides methods for accessing and updating them.

* View: Identify the different views that the website needs to display to users, such as a login page, exercise dashboard, and progress tracking page. Each view should be responsible for rendering data to the user and capturing user input. We create separate classes for each view and define interfaces for them.

* Presenter: The presenter acts as a mediator between the view and model. It processes user input and retrieves data from the model to update the view. We create separate classes for each presenter and define interfaces for them. For instance, we can create a LoginPresenter, ExercisePresenter, and ProgressPresenter.

* Connect the components: Connect the views and presenters using the MVP pattern. Each view should have a reference to its corresponding presenter, and each presenter should have a reference to its corresponding view and model.
Implement the features: Implement the features of the virtual rehabilitation program using the MVP pattern. For instance, we use the LoginPresenter to authenticate users, the ExercisePresenter to display and manage exercise programs, and the ProgressPresenter to track and display user progress.

By using the MVP pattern in our virtual rehabilitation website project, we achieve a clean separation of concerns and improve the maintainability, testability, and scalability of our codebase.

 * Be concise, yet precise. For example, "we use pull-requests" is not a precise statement since it leaves too many open questions - Pull-requests from where to where? Who reviews the pull-requests? Who is responsible for merging them? etc.
 * If applicable, specify any naming conventions or standards you decide to adopt.
 * Describe your overall deployment process from writing code to viewing a live application
 * What deployment tool(s) are you using? And how?
 * Don't forget to **briefly justify why** you chose this workflow or particular aspects of it!
​
 ## Licenses 
​
 Keep this section as brief as possible. You may read this [Github article](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository) for a start.
​
 * What type of license will you apply to your codebase? And why?
 * What affect does it have on the development and use of your codebase?

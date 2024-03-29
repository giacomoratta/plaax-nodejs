# CONCEPT

This project is being developed for learning purposes only.
The goal is to just learn more about the whole process of developing a full-stack nodejs service,
set up the cloud infrastructure and the deployment process. 


#### MAIN GOALS
- build a boilerplate for NodeJs-app (full setup typescript, eslint, jest, docker, docker-compose, project structure)
- build a simple backend layer (node, python, go, rust)
- build a simple frontend layer (js, react)
- use Cloudformation
- use Terraform
- deploy a backend layer on AWS
- deploy a frontend layer on AWS
- deploy a backend layer on GCP
- deploy a frontend layer on GCP
- deploy a backend layer on Azure
- deploy a frontend layer on Azure
- deploy the backend layer on AWS, GCP, Azure as not serverless
- build a boilerplate for Deno-app (full setup typescript, eslint, jest, docker, docker-compose, project structure)
- build a boilerplate for BunJs-app (full setup typescript, eslint, jest, docker, docker-compose, project structure)



#### THE IDEA FOR BACKEND
This is just an example of a generic serverless service on AWS with API Gateway, Lambda, EC2, ECS.
The actual initial project: provide an API layer for managing tasks for a ToDo list based on a calendar.

1. Provide backend
2. Easily develop locally
3. Logging layer
4. Excellent unit-tests (TDD)
5. Deploy to AWS on 2 environments: ACC and PRD
6. Set up a strategy for monitoring and observability on AWS
7. Provide authorization and authentication layers
8. Add an interaction with external API with auth
9. Good tests: integration, end-to-end (to test full flow, and test behavior with external API)


#### THE IDEA FOR FRONTEND
This is just an example of a generic serverless web-app on AWS with Lambda and Cloudfront.
The actual initial project: provide a complex UI and use the API layer implemented above.

1. Implement frontend with React and modern techniques
2. Do not waste much time to implement the perfect UI: make it working
3. Easily develop locally
4. Logging layer for frontend
5. Excellent unit-tests (TDD/BDD)
6. Deploy to AWS on 2 environments: ACC and PRD
7. Set up a strategy for monitoring and observability for frontend errors (e.g. Sentry)
8. Handle login and registration via Google, Facebook, etc.
9. Good tests: integration, end-to-end


#### BRANCHES
- tag branches?
- 1 main branch for a standard and simple setup, shared by all branches
- 1 branch for more features (auth, db, api)
- 1 branch for test features (integration and e2e), +triggered by github
- 1 branch for aws serverless deployment
- 1 branch for aws server-ec2 deployment
- 1 branch for different environments
- 1 branch for deployment triggered by github

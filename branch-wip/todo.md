## THE PROJECT (basics): concept of backend

#### Notes & Warnings
- DO NOT think about auth! Focus on api implementation, dynamodb, deploy to AWS.
  (Auth will be implemented in future steps).

#### Done
...


#### Work-in-progress
- create expected domain data
  - generate data returned by api (from plaax-example-data-env.json)
- define domain data

- define structure of api, gateway, repositories, etc. (clear architecture)
- TDD approach: start from api > repositories > gateway
  - get full test data from dynamo-db
 
  - tests
    - test single api controller > calls mocked-repository: get/post data as api-models,
      transform domain-models<-->api-models, simply handle errors, high-level error info
    - test repository function > calls mocked-gateway: get/post data, transform domain-models<-->gw-models,
      simply handle errors 
    - test gateway method > calls mocked-aws: get/post data as gw-models, handle errors, log technical warnings/errors
    - (useless?) test server-setup > calls mocked-api: call endpoints, check which api-controller has been called,
      ~~check reply in case of ok/error based on mocked data returned by the controller~~

- MOCK aws libraries on top level (./src/_\_mocks__)
- create basic api layer with common operations
  - get user board (multi project)
  - get user calendar (between dates)
  - add new item
  - add new item on calendar
- create specific dynamodb gateway
  - define db data models
- create specific app repository
  - define domain data models
  - interact with gateway
  - complex operations with db executed together, return complex domain objects

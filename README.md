# express-app
#### This app is a  simple stateless microservice in Nodejs, with three major functionalities
+ Authentication
+ Json patching
+ Image Thumbnail Generation


## Installation

Make sure that node and npm is installed.
### With npm
Clone the repository, install dependency, build and run
```
$ git clone https://github.com/NeelanjanaBRoy/express-app
$ cd express-app
$ npm install
$ npm run build
$ npm start

```

### Testing
* Run the test
```
$ npm test  or npm run test

```
* Javascript style and linting
```
$ npm run lint

```
* Code Coverage
```
$ istanbul cover ./node_modules/.bin/_mocha --compilers dist/test/*.js

```
### Usage
### Post Login

* Provide username and Password to get the token
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3000/login

```
* Provide Token to validate the user
```
curl -H "Authorization: JWT <token>" -H "Content-Type: application/json" -X POST http://localhost:3000/authorize

```
### Json-Patching
```
curl -H "Authorization: JWT <token>" -H "Content-Type: application/json" -X POST -d '{"jsonObject":{"baz": "qux","foo": "bar"},"Patch":[{ "op": "replace", "path": "/baz", "value": "boo" },{ "op": "add", "path": "/hello","value": ["world"] },{ "op": "remove", "path":"/foo"}]}' http://localhost:3000/api/patch

```
### Thumbnail_generations
```
curl -H "Authorization: JWT <token>" -H "Content-Type: application/json" -X POST http://localhost:3000/api/thumbnail?imageUrl=https://www.sitebuilderreport.com/assets/facebook-stock-up-446fff24fb11820517c520c4a5a4c032.jpg

```

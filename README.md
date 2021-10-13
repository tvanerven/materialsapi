# Materials browser front

Front application for materials browser. Use materials-browser-api project.

### Installation

**Required** : npm

#### 1. Download Angular CLI

`npm install -g @angular/cli`

#### 2. Clone project

```
git clone https://dci-gitlab.cines.fr/dad/materials-browser-front.git
cd materials-browser-front
```

#### 3. Install node_modules packages

From project root, execute : `npm install`

#### 4. Machine environment file 

For each machine where the project is deployed, there must modify machine environment variables. It can be found into file `src/assets/environment.json`.
```
// File example content: environment.json
{
  "apiUrl": "http://localhost:8000", # Materials browser API URL.
  "log": true # Show console log.
}
```

#### 5. Run development server

Launch `ng serve` from project root. With internet browser, go to address `http://localhost:4200/`.

#### 6. Create package to deploy

**WARNING** : API project directory **materials-browser-api** must be in the same directory than directory **materials-browser-front**.  

Launch script `build_package.sh` to create a zip archive :  
`dist/materials-browser-front/materials-browser.zip`.
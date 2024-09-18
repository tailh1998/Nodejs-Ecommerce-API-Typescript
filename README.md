<h1 align="center">
  NODEJS ECOMMERCE API TYPESCRIPT
</h1>
<h3 align="center"></h3>

[![Nodejs](https://img.shields.io/badge/Node.js-339933?logo=Node.js&logoColor=white)](https://github.com/nodejs)

## 📦 Table of Contents

1.  [Rules](#📜-rules)
2.  [Installation](#-installation)
3.  [Running the Project](#-running-the-project)
4.  [Project Structure](#-project-structure)
5.  [Code Review Process](#-code-review-process)
6.  [Building for Production](#-building-for-production)
7.  [Troubleshooting & FAQ](#-troubleshooting-&-faq)

## 📜 Rules

1. Take advantage of available util functions and services.
2. Write nice and clean code, line breaks after each declaration and each block.
3. Make good use of notes (comments).
4. Declare routers and variables in the right place according to the structure.
5. Handle ESLint errors & delete unused code before committing.
6. Avoid in-line TypeScript whenever possible.

## 💼 Requirements

Make sure you use node version `v20.8.0`

## 💾 Installation

After confirming that your environment meets the above [requirements](#💼-requirements), you can start this project by following the steps mentioned below:

### Clone the Repository

```bash
git https://github.com/tailh1998/nodejs-ecommerce-api-typescript.git
cd  nodejs-ecommerce-api-typescript
```

### Set Up Environment Variables

```bash
NODE_ENV=development
PORT=8017
HOST=0.0.0.0
MONGODB_URI=mongodb+srv://...
REDIS_URI=redis://...
# Other environment variables...
```

### Install packages

When that's done, install the project dependencies. It is recommended that you use [Yarn](https://yarnpkg.com/) for deterministic dependency management, but `npm install` will suffice.

```bash
yarn # or `yarn install` to install project dependencies
```

## ▶️ Running the Project

```bash

# For development environment

$ yarn start # Build the client bundles and start dev server

```

While developing, you will probably rely mostly on `yarn start`; however, there are additional scripts at your disposal:

| `yarn <script>` | Description                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| `yarn start`    | Starts the app at `http://localhost:8017/v1/api/health-check` by default      |
| `yarn build`    | Builds the app in production mode and serves files from build folder          |

## ▶️ Running the Project with Docker

```bash
# For development environment
docker-compose -f docker-compose.dev.yml up --build # Build the docker container and start dev server
```

## ✏️ Project Structure

```
.
├── .husky                                  # Git hooks
├── .vscode                                 # Vscode setting
├── docs                                    
├── keys-example                                    
├── README.md                               # Readme file for the whole app
├── .env.example                            # All environment variables example to be configured from here
├── package.json                            # All npm dependencies can be found here
├── public                                  # Public folder
├── src                                     # Application main source code
│   ├── index.ts                            # This file is the entry file for the application, only used for setting up server, logger and wrapping application with providers.
│   ├── app.ts                              # Defines routes, middlewares, init database, ...
│   ├── @types                              # Common used interfaces/types
│   │   └── index.ts
│   ├── auth                                # Defines auth function and function check apiKey
│   │   ├── auth.utils.ts 
│   │   └── checkAuth.ts
│   ├── configs                             # Global configs
│   │   ├── <xxx>.config.ts                 # The naming convention of files
│   │   ├── aws.config.ts                 
│   │   ├── cloudinary.config.ts          
│   │   ├── cors.config.ts                
│   │   ├── database.config.ts            
│   │   ├── multer.config.ts              
│   │   ├── node-mailer.config.ts         
│   │   └── redis.config.ts               
│   ├── constants                           # Folder for constants
│   │   ├── ...
│   │   └── index.ts
│   ├── controllers                         # Handles incoming requests and sends responses.
│   │   ├── <xxx>.controller.ts             # The naming convention of files
│   │   └── ...
│   ├── services                            # Contains business logic and interacts with models. Services decouple business logic from controllers.
│   │   ├── <xxx>.service.ts                # The naming convention of files
│   │   └── ...
│   ├── models                              # Schema definitions and database interaction logic (e.g., User, Product).
│   │   ├── <xxx>.model.ts                  # The naming convention of files
│   │   └── ...                            
│   ├── core                                # Defines response
|   |   ├── error.response.ts
│   │   └── success.response.ts
│   ├── factories                           # Implement factory pattern
│   │   └── <model_name>
│   │       ├── <xxx>.factory.ts            # The naming convention of files
│   │       └── index.ts
│   ├── helpers
│   │   └── ...
│   ├── middleware
│   │   └── ...
│   ├── routes
│   │   └── <version>
│   │       ├── ...            
│   │       └── index.ts
│   ├── tests
│   │   └── ...
│   ├── utils                               # A folder for Utility methods and Helpers
│   │   └── ...
│   └── validations                         
│       └── ...
├── .commitlintrc.json                      # Commitlint configuration file
├── .cspell.json                            # Spell Check config
├── .cspell.txt                             # Ignore spell check list
├── .dockerignore                           
├── .editorconfig                           
├── .eslintignore                           
├── .eslintrc.cjs                           
├── .gitattributes                           
├── .gitignore                              # List of ignored files/folders
├── .lintstagedrc.json                           
├── .npmrc                           
├── .nvmrc                           
├── .prettierrc.json                        # Prettier config
├── .prettierrcignore                      
├── babel.config.js                         # Babel configuration file
├── LICENSE                      
├── nodemon.json                            # Nodemon configuration file
├── webpack.config.js                       # Used to customize the webpack configuration
├── tsconfig.json                           # TypeScript configuration file
├── yarn-error.log
└── yarn.lock                               # Yarn lock file for locking the dependency versions
```

## 🐞 Code Review Process

- Make sure your code pass ESLint
- Resolve conflicts (if any)
- Create a Pull Request (Merge Request), and comment the link to `<xx>-pr` channel with the following syntax: `[MR name] [Link] [Reviewers]`. Tag at least **2 members** to review your MR
- After the MR has at least **2 approvals**, the **last person** who approves will merge, and **comment "Merged"** to the thread.

## 🚚 Building for Production

Clean up the `/build` folder with:

```bash
yarn clean
```

To build the project, run:

```bash
yarn build
```

## 📃 License

**Node** is available under the [MIT license](https://opensource.org/licenses/MIT). The full text of this license can be found at [Nodejs License](https://github.com/nodejs/node/blob/main/LICENSE)

**Express** is available under the [MIT license](https://opensource.org/licenses/MIT). The full text of this license can be found at [Express License](https://github.com/expressjs/express/blob/master/LICENSE)

**Webpack** is available under the [MIT license](https://opensource.org/licenses/MIT). The full text of this license can be found at [Webpack License](https://github.com/webpack/webpack/blob/main/LICENSE)

**Babel** is available under the [MIT license](https://opensource.org/licenses/MIT). The full text of this license can be found at [Babel License](https://github.com/babel/babel/blob/main/LICENSE)

## 📃 License list

| Library Name      | License Name  | Remark        |
| -------------     | ------------- | --------      |
| Node              |  MIT License  |  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   |
| Express           |  MIT License  |  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   |
| Webpack           |  MIT License  |  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   |
| Babel             |  MIT License  |  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   |

npm init
npm install --save express
npm install --save sequelize
npm install --save mysql2
npm install --save astest-validator(for validation)
npm install --save bcryptjs(for encrption)
npm install --save jsonwebtoken(for token generation)
npm install --save nodemon(for auto update npm, no need for restart)

brew services start mysql
brew services stop mysql
brew services list

npm sequelize model:generate --name Post --attributes title:string,content:text,userId:integer


mysql -u root -p
Abhilash@3246



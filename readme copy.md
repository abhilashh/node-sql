npm init
npm install --save express
npm install --save sequelize
npm install --save mysql2
npm install --save astest-validator(for validation)
npm install --save bcryptjs(for encrption)
npm install --save jsonwebtoken(for token generation)
npm install --save nodemon(for auto update npm, no need for restart)
npm install --save multer(for image upload)

brew services start mysql
brew services stop mysql
brew services list

npm sequelize model:generate --name Post --attributes title:string,content:text,userId:integer

sequelize seed:generate --name category-seeder (to create seeder file, seeder files will helps to create base files, like bulk insert to the table)

sequelize db:seed --seed 20261015093048-category-seeder.js (to run single seed file)
sequelize db:seed:all(to run all seed file at a time)


mysql -u root -p
Abhilash@3246



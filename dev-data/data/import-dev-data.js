const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });
//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

//IMPORT DATA INTO DATABASE
const importTours = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//DELETE ALL DATA FROM DATABASE
const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'))
  .catch((error) => console.log(error));

console.log(process.argv);

if (process.argv[2] === '--import') {
  importTours();
}
if (process.argv[2] === '--delete') {
  deleteTours();
}

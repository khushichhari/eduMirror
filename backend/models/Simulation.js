// import mongoose from 'mongoose';

// const simulationSchema = new mongoose.Schema({
//   name: String,
//   careerPath: String,
//   result: Object,
//   date: { type: Date, default: Date.now },
// });

// const Simulation = mongoose.model('Simulation', simulationSchema);

// export default Simulation;


// new

import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  name: String,
  careerPath: String,
  result: String, // Changed from Object to String
  date: { type: Date, default: Date.now },
});

const Simulation = mongoose.model('Simulation', simulationSchema);

export default Simulation;

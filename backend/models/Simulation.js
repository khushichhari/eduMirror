// import mongoose from 'mongoose';

// const simulationSchema = new mongoose.Schema({
//   name: String,
//   careerPath: String,
//   result: Object,
//   date: { type: Date, default: Date.now },
// });

// const Simulation = mongoose.model('Simulation', simulationSchema);

// export default Simulation;


import mongoose from "mongoose";

const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  careerPath: { type: String, required: true },
  result: { type: Object, required: true },
  date: { type: Date, default: Date.now },
});

const Simulation = mongoose.model("Simulation", simulationSchema);

export default Simulation;

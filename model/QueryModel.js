import mongoose from "mongoose";


// Schema and Model for storing queries
const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  query: { type: String, required: true },
});

const QueryModel = mongoose.model('Query', querySchema);

export default QueryModel;
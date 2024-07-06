// Import necessary modules using ES6 import syntax
import mongoose from 'mongoose';


// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/your-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schema
const registerSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['caregiver', 'patient'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  county: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  agreeTerms: {
    type: Boolean,
    required: true,
  },
  agreePrivacyPolicy: {
    type: Boolean,
    required: true,
  },
  caregiverID: {
    type: String,
    required: function() {
      return this.role === 'caregiver';
    },
  },
  patientID: {
    type: String,
    required: function() {
      return this.role === 'patient';
    },
  },
},{timestamps:true});

// Compile the schema into a model
const User = mongoose.model('User', registerSchema);

// Export the User model for use in other parts of your application
export default User;

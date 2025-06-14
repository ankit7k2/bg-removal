import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkID:{
    type: String,
    required: true,
    unique: true
    },
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
  email: {
    type: String,
    required: true,
    unique: true
  },
//   password: {
//     type: String,
//     required: true
//   },
  photo: {
    type: String,
    //required: true,
  },
  firstName: {
    type: String,
   // required: true
  },
  lastName: {
    type: String,
    // required: true
  },
  creditBalance: {
    type: Number,
    default: 5
  },
});

const userModels = mongoose.model.user|| mongoose.model('User', userSchema);

export default userModels;

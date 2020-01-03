import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  return next();
});

UserSchema.methods.comparePassword = async function(plaintext) {
  const match = await bcrypt.compare(plaintext, this.password);
  return match;
};

export default mongoose.model('User', UserSchema);

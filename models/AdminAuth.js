import mongoose from 'mongoose';

const adminAuthSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: 'main',
      unique: true,
      immutable: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    iterations: {
      type: Number,
      default: 120000,
      min: 100000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.AdminAuth ||
  mongoose.model('AdminAuth', adminAuthSchema);

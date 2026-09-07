import mongoose from 'mongoose';

const resumeAssetSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: 'main',
      unique: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'resume.pdf',
    },
    contentType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
    data: {
      type: Buffer,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.ResumeAsset ||
  mongoose.model('ResumeAsset', resumeAssetSchema);

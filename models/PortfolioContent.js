import mongoose from 'mongoose';

const { Schema } = mongoose;

const requiredString = { type: String, trim: true, required: true };
const optionalString = { type: String, trim: true, default: '' };

const projectSchema = new Schema(
  {
    id: requiredString,
    title: requiredString,
    description: requiredString,
    tech: { type: [String], default: [] },
    github: optionalString,
    live: optionalString,
    gradient: { type: String, default: 'from-blue-500 to-cyan-500' },
    icon: { type: String, default: 'FaCode' },
  },
  { _id: false }
);

const skillSchema = new Schema(
  {
    id: requiredString,
    name: requiredString,
    color: { type: String, default: 'from-blue-500 to-cyan-500' },
  },
  { _id: false }
);

const educationSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaGraduationCap' },
    title: requiredString,
    institution: requiredString,
    stream: optionalString,
    color: { type: String, default: 'from-blue-500 to-cyan-500' },
  },
  { _id: false }
);

const contactSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaEnvelope' },
    label: requiredString,
    value: requiredString,
    link: optionalString,
  },
  { _id: false }
);

const socialSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaGithub' },
    name: requiredString,
    url: requiredString,
    color: { type: String, default: 'from-slate-700 to-slate-900' },
    description: optionalString,
  },
  { _id: false }
);

const personalInfoSchema = new Schema(
  {
    name: { type: String, trim: true, default: 'Dawood Rehman' },
    title: { type: String, trim: true, default: 'Full-Stack Developer' },
    bio: optionalString,
    image: optionalString,
  },
  { _id: false }
);

const passionSchema = new Schema(
  {
    id: requiredString,
    icon: { type: String, default: 'FaCode' },
    title: requiredString,
    description: requiredString,
  },
  { _id: false }
);

const resumeSchema = new Schema(
  {
    url: optionalString,
    name: optionalString,
    contentType: optionalString,
    data: optionalString,
    size: { type: Number, default: 0 },
    uploadedAt: { type: Date },
  },
  { _id: false }
);

const portfolioContentSchema = new Schema(
  {
    singleton: {
      type: String,
      default: 'main',
      unique: true,
      immutable: true,
    },
    projects: { type: [projectSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    contactInfo: { type: [contactSchema], default: [] },
    socialLinks: { type: [socialSchema], default: [] },
    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    passions: { type: [passionSchema], default: [] },
    resume: { type: resumeSchema, default: null },
    profilePicture: optionalString,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.PortfolioContent ||
  mongoose.model('PortfolioContent', portfolioContentSchema);

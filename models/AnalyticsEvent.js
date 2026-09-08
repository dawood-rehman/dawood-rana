import mongoose from 'mongoose';

const { Schema } = mongoose;

const analyticsEventSchema = new Schema(
  {
    type: {
      type: String,
      default: 'pageview',
      index: true,
    },
    path: {
      type: String,
      default: '/',
      trim: true,
      index: true,
    },
    referrer: {
      type: String,
      default: 'Direct',
      trim: true,
    },
    browser: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    os: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'desktop',
      index: true,
    },
    country: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    visitorHash: {
      type: String,
      required: true,
      index: true,
    },
    visitorName: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for fast reporting queries
analyticsEventSchema.index({ type: 1, timestamp: -1 });
analyticsEventSchema.index({ visitorHash: 1, timestamp: -1 });

// TTL index: Automatically prune records older than 90 days (7,776,000 seconds)
analyticsEventSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

if (mongoose.models.AnalyticsEvent) {
  delete mongoose.models.AnalyticsEvent;
}

export default mongoose.model('AnalyticsEvent', analyticsEventSchema);

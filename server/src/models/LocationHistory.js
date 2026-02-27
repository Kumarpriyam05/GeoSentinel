import mongoose from "mongoose";

const { Schema, model } = mongoose;

const locationHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      index: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    speed: {
      type: Number,
      default: 0,
    },
    heading: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      enum: ["ingest", "dashboard", "simulator"],
      default: "ingest",
    },
    capturedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false },
);

locationHistorySchema.index({ coordinates: "2dsphere" });
locationHistorySchema.index({ device: 1, capturedAt: -1 });
locationHistorySchema.index({ capturedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const LocationHistory = model("LocationHistory", locationHistorySchema);

export default LocationHistory;

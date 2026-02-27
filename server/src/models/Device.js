import mongoose from "mongoose";

const { Schema, model } = mongoose;

const lastLocationSchema = new Schema(
  {
    lat: Number,
    lng: Number,
    speed: Number,
    heading: Number,
    accuracy: Number,
    timestamp: Date,
  },
  { _id: false },
);

const deviceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ingestKeyHash: {
      type: String,
      required: true,
      select: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastActiveAt: {
      type: Date,
      default: null,
      index: true,
    },
    lastLocation: {
      type: lastLocationSchema,
      default: null,
    },
  },
  { timestamps: true },
);

deviceSchema.index({ user: 1, updatedAt: -1 });
deviceSchema.index({ name: "text" });

deviceSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.ingestKeyHash;
  },
});

const Device = model("Device", deviceSchema);

export default Device;

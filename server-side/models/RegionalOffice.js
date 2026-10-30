import mongoose from "mongoose";

const regionalOfficeSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

regionalOfficeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

regionalOfficeSchema.set("toJSON", { virtuals: true });
regionalOfficeSchema.set("toObject", { virtuals: true });

const RegionalOffice = mongoose.models.RegionalOffice || mongoose.model("RegionalOffice", regionalOfficeSchema);

export default RegionalOffice;


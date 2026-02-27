import mongoose from "mongoose";
import { PAYMENT_GETWAY } from "../constants/constant.js";

const refundSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    amount: {
      type: Number,
    },
    paymentType: {
      type: String,
      enum: PAYMENT_GETWAY,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
    policy: {
      type: String,
    },
  },
  { timestamps: true },
);

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;

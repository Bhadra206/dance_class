import mongoose from "mongoose";

const LedgerSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    name: { type: String, required: true },
    adm_no: { type: String, required: true },
    amount: { type: Number, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    batch: { type: String, required: true },
    month:{type: String, required: true },
  },
  { collection: "ledger" }
);

const Ledger = mongoose.model("Ledger", LedgerSchema);

export default Ledger;

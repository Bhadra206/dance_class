import mongoose from "mongoose";



const LedgerSchema = new mongoose.Schema(
  {
    date:{ type: Date, required: true },
    name:{ type: String, required: true },
    amount:{ type: Number, required: true },
  },
  { collection: "ledger" }
);

const Ledger = mongoose.model("LedgerSchema", LedgerSchema);

export default Ledger;
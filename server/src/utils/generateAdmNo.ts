// server/src/utils/generateAdmNo.ts
import AdmNumber from "../schemas/admNumberSchema";

export const getNextAdmissionNumber = async (): Promise<string> => {
  const admNumber = await AdmNumber.findByIdAndUpdate(
    { _id: "admission_counter" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = admNumber.seq.toString().padStart(4, "0"); // e.g., 0001, 0002
  return `ADM${padded}`;
};

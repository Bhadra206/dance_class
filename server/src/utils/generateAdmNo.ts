import AdmNumber from "../schemas/admNumberSchema";

export const getNextAdmissionNumber = async (): Promise<string> => {
  // Find the admission counter document
  const admNumber = await AdmNumber.findById("admission_counter");

  // If seq is not set or the reset condition is true, reset to 1
  if (!admNumber || admNumber.seq === 0) {
    // Reset the seq field to 1 (this happens only once)
    await AdmNumber.findByIdAndUpdate(
      "admission_counter",
      { $set: { seq: 1 } },
      { upsert: true }
    );
  } else {
    // Otherwise, increment the seq field by 1
    await AdmNumber.findByIdAndUpdate(
      "admission_counter",
      { $inc: { seq: 1 } },
      { new: true }
    );
  }

  // Get the updated value of seq
  const updatedAdmNumber = await AdmNumber.findById("admission_counter");

  // Return the padded admission number with leading zeros (e.g., ADM0001, ADM0002)
  const padded = updatedAdmNumber!.seq.toString().padStart(4, "0");
  return `ADM${padded}`;
};

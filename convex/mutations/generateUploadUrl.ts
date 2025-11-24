import { mutationGeneric as mutation } from "convex/server";

export default mutation(async ({ storage }) => {
  // Return a short-lived upload URL which accepts a POST with the file bytes
  return await storage.generateUploadUrl();
});

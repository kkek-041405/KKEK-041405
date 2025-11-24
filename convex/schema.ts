import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.float64()),
    bytes: v.optional(v.bytes()),
    createdAt: v.float64(),
    storageId: v.string(),
    firestoreNoteId: v.optional(v.string()),
  }),
});

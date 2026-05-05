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
  sms: defineTable({
    deviceId: v.optional(v.string()),
    messageId: v.optional(v.string()),
    threadId: v.optional(v.string()),
    address: v.optional(v.string()),
    body: v.optional(v.string()),
    type: v.optional(v.string()),
    direction: v.optional(v.string()),
    dateMillis: v.optional(v.float64()),
    readAt: v.optional(v.float64()),
    payload: v.optional(v.string()),
    createdAt: v.float64(),
  }),
});

import { mutationGeneric as mutation } from "convex/server";

export default mutation(async ({ db, storage, auth }, { storageId, convexDocumentId }: any) => {
  // TODO: enforce auth/ownership checks here (ownerUserId vs auth.userId)

  try {
    if (storageId) {
      await storage.delete(storageId as any);
    }

    if (convexDocumentId) {
      // db.delete accepts a single Id parameter
      await db.delete(convexDocumentId as any);
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as any)?.message ?? String(err) };
  }
});

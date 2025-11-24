import { queryGeneric as query } from "convex/server";

export default query({
  handler: async ({ db, storage }: any, { storageId }: { storageId: string }) => {
    // Try to find metadata in our `documents` table first
    const all = await db.query("documents").collect();
    const found = all.find((d: any) => d.storageId === storageId);
    const metaFromDb = found
      ? {
          convexDocumentId: found._id,
          storageId: found.storageId,
          fileName: found.fileName,
          fileType: found.fileType,
          fileSize: found.fileSize,
          createdAt: found.createdAt,
        }
      : null;

    // Get a short-lived URL for serving; may be null if file deleted
    const url = await storage.getUrl(storageId as any);

    // Also fetch system metadata for fallback info if DB record is missing
    const sys = await db.system.get(storageId as any);

    const result: any = {
      storageId,
      url,
      fileName: metaFromDb?.fileName ?? undefined,
      fileType: metaFromDb?.fileType ?? sys?.contentType,
      fileSize: metaFromDb?.fileSize ?? sys?.size,
      createdAt: metaFromDb?.createdAt ?? sys?._creationTime,
      convexDocumentId: metaFromDb?.convexDocumentId ?? null,
    };

    return result;
  },
});

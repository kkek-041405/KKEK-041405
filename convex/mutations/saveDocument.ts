import { mutationGeneric as mutation } from "convex/server";

export default mutation(async ({ db, auth }, { storageId, fileName, fileType, fileSize, firestoreNoteId }: any) => {
  // Save metadata about a file already stored in Convex storage (storageId)
  const createdAt = Date.now();

  const insertObj: any = {
    storageId,
    fileName,
    fileType,
    fileSize,
    createdAt,
  };
  if (firestoreNoteId) insertObj.firestoreNoteId = firestoreNoteId;
  if (auth && (auth as any).userId) insertObj.ownerUserId = (auth as any).userId;

  const id = await db.insert("documents", insertObj);

  return {
    convexDocumentId: id,
    storageId,
    fileName,
    fileType,
    fileSize,
    createdAt,
  };
});
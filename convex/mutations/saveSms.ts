import { mutationGeneric as mutation } from "convex/server";

export default mutation(async ({ db }, sms: any) => {
  const timestamp = Date.now();
  const record = {
    deviceId: sms.deviceId,
    messageId: sms.messageId,
    threadId: sms.threadId,
    address: sms.address,
    body: sms.body,
    type: sms.type,
    direction: sms.direction,
    dateMillis: sms.dateMillis,
    readAt: sms.readAt,
    payload: sms.payload,
    createdAt: timestamp,
  };

  const id = await db.insert("sms", record);
  return { success: true, id };
});

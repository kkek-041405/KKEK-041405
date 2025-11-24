export async function uploadFileToServer(file: File): Promise<any | null> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/notes/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Error uploading file to server:', err);
    return null;
  }
}

export async function getFileDownloadUrl(storageId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/notes/download?storageId=${encodeURIComponent(storageId)}`, { method: 'HEAD' });
    if (!res.ok) return null;
    return `/api/notes/download?storageId=${encodeURIComponent(storageId)}`;
  } catch (err) {
    console.error('Error getting file download url:', err);
    return null;
  }
}

/**
 * Resolve the file's serving URL by asking the app server to query Convex.
 * This returns the direct short-lived serving URL returned by Convex's storage
 * (if available) and other metadata — useful for opening the file in a new tab
 * for previewing.
 */
export async function getFileServingUrl(storageId: string): Promise<{ url?: string | null; fileName?: string | null; fileType?: string | null } | null> {
  try {
    console.log('[file-upload-service] resolving serving url for storageId', storageId);
    const res = await fetch(`/api/notes/resolve?storageId=${encodeURIComponent(storageId)}`);
    console.log('[file-upload-service] /api/notes/resolve HTTP status', res.status);
    if (!res.ok) return null;
    const json = await res.json();
    console.log('[file-upload-service] /api/notes/resolve JSON', json);
    // json includes { url, fileName, fileType, fileSize, createdAt, convexDocumentId }
    return {
      url: json?.url ?? null,
      fileName: json?.fileName ?? null,
      fileType: json?.fileType ?? null,
    };
  } catch (err) {
    console.error('[file-upload-service] Error resolving file serving url:', err);
    return null;
  }
}


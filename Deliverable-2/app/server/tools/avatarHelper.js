const azure = require('azure-storage');
const { pool } = require('../dbConfig');

const getAvatarUrl = async (exercise, character) => {
  const query = `SELECT Path FROM Avatar WHERE Exercise = $1 AND Character = $2`;
  const result = await pool.query(query, [exercise, character]);
  if (result.rows.length === 0) {
    return '';
  }
  const blobService = azure.createBlobService(
    "nathanstorageacc",
    "85KldYJGMTuKkFBo4mjybea1iQKgdoO7RVGJkady7urYYOltyvxyyO1+mKsRxyv4rWeFSzeuTTZE+AStqcWHgQ==",
    "https://nathanstorageacc.blob.core.windows.net"
  );
  const blobName = result.rows[0].Path;
  const sasToken = blobService.generateSharedAccessSignature(
    'avatar-video',
    blobName,
    {
      AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Expiry: new Date(Date.now() + 15 * 60 * 1000)
      }
    }
  );
  const blobUrl = blobService.getUrl('avatar-video', blobName, sasToken);
  return blobUrl;
};

module.exports = {
  getAvatarUrl,
};

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { secretsClient } from "../lib/secrets-manager.client.js";
import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { CLOUDFRONT_PRIVATE_KEY } from "../constants/constant.js";

const cloudfrontDistributionDomain = process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN;

const keyPairId = process.env.KEY_PAIR_ID;

const dateLessThan = new Date(Date.now() + 3600 * 1000);

let cachedPrivateKey;

const sanitizeFilenameASCII = (filename) => {
  const unique = Date.now().toString(36);

  if (!filename || typeof filename !== "string") {
    return `download-${unique}`;
  }

  if (/^[\x20-\x7E]+$/.test(filename)) {
    return filename;
  }

  const ext = filename.match(/\.[a-zA-Z0-9]+$/)?.[0] || "";

  return `download-${unique}${ext}`;
};

async function getPrivateKey() {
  if (cachedPrivateKey) return cachedPrivateKey;
  const SecretId = process.env.SECRET_CF_KEY;

  const res = await secretsClient.send(
    new GetSecretValueCommand({
      SecretId,
    }),
  );

  const secretString = res.SecretString;
  const privateKey = JSON.parse(secretString);

  cachedPrivateKey = privateKey[SecretId];

  return cachedPrivateKey;
}

export const generateCloudfrontSignedUrl = async (
  s3ObjectKey,
  fileName,
  isDownload,
) => {
  let privateKey;
  if (CLOUDFRONT_PRIVATE_KEY) {
    privateKey = CLOUDFRONT_PRIVATE_KEY;
  } else {
    privateKey = await getPrivateKey();
  }
  const safeFileName = sanitizeFilenameASCII(fileName);
  const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}?response-content-disposition=${encodeURIComponent(`${isDownload ? "attachment" : "inline"} ;filename="${safeFileName}"`)}`;
  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey: atob(privateKey),
  });
  return signedUrl;
};

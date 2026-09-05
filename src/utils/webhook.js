import crypto from "crypto";

export function generateWebhookApiKey() {
    const random = crypto.randomBytes(32).toString("hex");

    return `wh_live_${random}`;
}

export function hashWebhookApiKey(apiKey) {
    return crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");
}

export function getWebhookApiKeyPrefix(apiKey) {
    return apiKey.substring(0, 15);
}

export function verifyWebhookApiKey(apiKey, storedHash) {
    if (!apiKey || !storedHash) {
        return false;
    }

    const incomingHash = hashWebhookApiKey(apiKey);

    const incomingBuffer = Buffer.from(incomingHash, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (incomingBuffer.length !== storedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        incomingBuffer,
        storedBuffer
    );
}

export function getBearerToken(request) {
    const authorization = request.headers.get("authorization");

    if (!authorization) {
        return null;
    }

    const [scheme, token] = authorization.split(" ");

    if (
        scheme?.toLowerCase() !== "bearer" ||
        !token
    ) {
        return null;
    }

    return token.trim();
}
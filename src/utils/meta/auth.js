import jwt from "jsonwebtoken";

export function getSellerIdFromRequest(request) {
    const cookieName =
        process.env.COOKIE_NAME;

    const token =
        request.cookies.get(cookieName)?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sellerId =
        decoded.userId ||
        decoded.id ||
        decoded._id;
    console.log(sellerId)
    if (!sellerId) {
        throw new Error("Invalid authentication token");
    }

    return sellerId;
}
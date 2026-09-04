const META_GRAPH_API_VERSION =
    process.env.META_GRAPH_API_VERSION || "v23.0";

export const META_GRAPH_URL =
    `https://graph.facebook.com/${META_GRAPH_API_VERSION}`;

export async function metaGet(
    path,
    params = {},
    accessToken
) {
    const url = new URL(`${META_GRAPH_URL}${path}`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
        }
    });

    if (accessToken) {
        url.searchParams.set("access_token", accessToken);
    }

    const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(
            data?.error?.message ||
            "Meta API request failed"
        );
    }

    return data;
}

export async function metaPost(
    path,
    body = {},
    accessToken
) {
    const url = new URL(`${META_GRAPH_URL}${path}`);

    if (accessToken) {
        url.searchParams.set(
            "access_token",
            accessToken
        );
    }

    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(
            data?.error?.message ||
            "Meta API request failed"
        );
    }

    return data;
}
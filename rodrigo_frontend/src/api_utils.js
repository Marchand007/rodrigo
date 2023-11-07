"use strict";

export function addApiPrefixToPath(path) {
    const cacheKey = + new Date();
    return "/rodrigo-rodrigo-backend" + path + "?v=" + cacheKey;
}

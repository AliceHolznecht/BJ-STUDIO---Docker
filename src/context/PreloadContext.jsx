import { createContext } from "react";

/**
 * This context will hold the preloaded asset data.
 * For media like video and audio, it will store a map of
 * { originalSrc: blobUrl }.
 */
export const PreloadContext = createContext(null);
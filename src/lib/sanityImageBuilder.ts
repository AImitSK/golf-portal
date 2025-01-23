// src/lib/sanityImageBuilder.ts
import createImageUrlBuilder from "@sanity/image-url";
import sanityClient from "./sanityClient";

export const urlForImage = (source: any) => {
    return createImageUrlBuilder(sanityClient).image(source);
};
import { URL } from "url";
import path from "path";

const CLOUDINARY_HOSTNAME = "res.cloudinary.com";
const DEFAULT_IMAGE_SIZES = [160, 320, 480, 640, 960, 1280, 2560];

export const getImageSrcset = (
  url: string,
  ext?: string,
  imageSizes: number[] = DEFAULT_IMAGE_SIZES
): string | undefined => {
  const parsed = new URL(url);
  if (parsed.hostname !== CLOUDINARY_HOSTNAME) {
    return undefined;
  }

  const [cloudName, ...rest] = parsed.pathname.split("/").slice(1);
  if (!(rest[0] === "image" && rest[1] === "upload")) {
    return undefined;
  }

  const [version, filePath] =
    rest[2][0] === "v"
      ? [rest[2], rest.slice(3).join("/")]
      : [rest[3], rest.slice(4).join("/")];

  const newFilePath = ext
    ? `${filePath.slice(
        0,
        filePath.length - path.posix.extname(filePath).length
      )}${ext}`
    : filePath;

  return imageSizes
    .map(
      (size) =>
        `https://${CLOUDINARY_HOSTNAME}/${cloudName}/image/upload/c_limit,w_${size}/${version}/${newFilePath} ${size}w`
    )
    .join(", ");
};

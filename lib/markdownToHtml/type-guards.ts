import { Node, Parent } from "unist";
import { Text, Image } from "mdast";
import { ImageWithOptions, IMAGE_WITH_OPTIONS_TYPE } from "./unified-plugins";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isTextNode = (node: Node): node is Text => node.type === "text";

export const isImageNode = (node: Node): node is Image => node.type === "image";

export const isImageWithOptionsNode = (node: Node): node is ImageWithOptions =>
  node.type === IMAGE_WITH_OPTIONS_TYPE;

export const isParent = (value: unknown): value is Parent =>
  isObject(value) && Array.isArray(value.children);

import { fail } from "assert";
import { Node, Parent } from "unist";
import { Text, Image } from "mdast";
import {
  isImageNode,
  isImageWithOptionsNode,
  isParent,
  isTextNode,
} from "./type-guards";
import { ImageWithOptions } from "./unified-plugins";

export function assertTextNode(node: Node): asserts node is Text {
  if (!isTextNode(node)) {
    fail("node isn't Text");
  }
}

export function assertImageNode(node: Node): asserts node is Image {
  if (!isImageNode(node)) {
    fail("node isn't Image");
  }
}

export function assertParent(value: unknown): asserts value is Parent {
  if (!isParent(value)) {
    fail("value isn't Parent");
  }
}

export function assertImageWithOptionsNode(
  node: Node
): asserts node is ImageWithOptions {
  if (!isImageWithOptionsNode(node)) {
    fail("node isn't ImageWithOptions");
  }
}

import unified from "unified";
import { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import { assertTextNode } from "./asserts";
import { isImageSyntax, parseImageSyntax } from "./parseImageSyntex";

export const IMAGE_WITH_OPTIONS_TYPE = "image_with_options" as const;

export interface ImageWithOptions extends Node {
  type: typeof IMAGE_WITH_OPTIONS_TYPE;
  url: string;
  alt: string;
  title?: string;
  options: Record<string, boolean | string>;
}

// allow "![title](url options)" syntax
export const allowImageOptions: unified.Plugin = () => {
  return (tree) => {
    visit(tree, "text", (node: Node, index: number, parent: Parent) => {
      assertTextNode(node);

      if (!isImageSyntax(node.value)) {
        return;
      }

      const result = parseImageSyntax(node.value);
      parent.children[index] = {
        type: result.options ? IMAGE_WITH_OPTIONS_TYPE : "image",
        ...result,
      };
    });
  };
};

import { Handlers } from "mdast-util-to-hast";
import { assertImageNode, assertImageWithOptionsNode } from "./asserts";
import { getImageSrcset } from "./getImageSrcset";
import { IMAGE_WITH_OPTIONS_TYPE } from "./unified-plugins";

const createImageElements = (
  url: string,
  alt: string | undefined,
  title: string | undefined,
  vertical: boolean = false
) => ({
  type: "element",
  tagName: "div",
  properties: {
    className: `image${vertical ? " image--is-vertical" : ""}`,
  },
  children: [
    {
      type: "element",
      tagName: "picture",
      children: [
        {
          type: "element",
          tagName: "source",
          properties: {
            type: "image/webp",
            srcset: getImageSrcset(url, ".webp"),
          },
        },
        {
          type: "element",
          tagName: "img",
          properties: {
            src: url,
            srcset: getImageSrcset(url),
            alt,
            title,
          },
        },
      ],
    },
  ],
});

export const remark2rehypeHandlers: Handlers = {
  [IMAGE_WITH_OPTIONS_TYPE]: (h, node) => {
    assertImageWithOptionsNode(node);
    return createImageElements(
      node.url,
      node.alt,
      node.title,
      !!node.options.vertical
    );
  },
  image: (h, node) => {
    assertImageNode(node);
    return createImageElements(node.url, node.alt, node.title);
  },
};

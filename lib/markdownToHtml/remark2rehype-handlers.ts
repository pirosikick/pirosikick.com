import { Handlers } from "mdast-util-to-hast";
import { assertImageWithOptionsNode } from "./asserts";
import { IMAGE_WITH_OPTIONS_TYPE } from "./unified-plugins";

export const remark2rehypeHandlers: Handlers = {
  [IMAGE_WITH_OPTIONS_TYPE]: (h, node) => {
    assertImageWithOptionsNode(node);

    const classNames = ["image"];
    if (node.options.vertical) {
      classNames.push("image--is-vertical");
    }

    return {
      type: "element",
      tagName: "div",
      properties: {
        className: classNames.join(" "),
      },
      children: [
        {
          type: "element",
          tagName: "img",
          properties: {
            src: node.url,
            alt: node.alt,
            title: node.title,
          },
        },
      ],
    };
  },
};

import assert from "assert";
import { URL } from "url";
import unified from "unified";
import remark2rehype from "remark-rehype";
import remark from "remark-parse";
import html from "rehype-stringify";
import shiki from "rehype-shiki";
import remarkEmbedder, { Transformer } from "@remark-embedder/core";

const YouTubeTransformer: Transformer = {
  name: "YouTube",
  shouldTransform(url) {
    console.log(url);
    const { host, pathname, searchParams } = new URL(url);
    return (
      host === "www.youtube.com" &&
      pathname === "/watch" &&
      !!searchParams.get("v")
    );
  },
  getHTML(url) {
    const { searchParams } = new URL(url);
    const v = searchParams.get("v");
    assert(typeof v === "string");

    const iframeURL = `https://www.youtube-nocookie.com/embed/${v}`;
    const attrs = [
      'width="560"',
      'height="315"',
      `src="${iframeURL}"`,
      'frameborder="0"',
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"',
      "allowfullscreen",
    ].join(" ");
    return `<div data-embedded-media="youtube"><iframe ${attrs}></iframe></div>`;
  },
};

export default async function markdownToHtml(
  markdown: string
): Promise<string> {
  const result = await unified()
    .use(remark)
    .use(remarkEmbedder, { transformers: [YouTubeTransformer] })
    .use(remark2rehype)
    .use(html)
    .use(shiki)
    .process(markdown);

  return result.toString();
}

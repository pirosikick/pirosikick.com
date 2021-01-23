import assert from "assert";
import { URL } from "url";
import unified from "unified";
import remark2rehype from "remark-rehype";
import remark from "remark-parse";
import html from "rehype-stringify";
import shiki from "rehype-shiki";
import remarkEmbedder, { Transformer } from "@remark-embedder/core";
import fetch from "node-fetch";

const wrapEmbededHTML = (name: string, innerHTML: string) =>
  `<div data-embedded-media="${name}">${innerHTML}</div>`;

const YouTubeTransformer: Transformer = {
  name: "YouTube",
  shouldTransform(url) {
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
    const iframe = `<iframe ${attrs}></iframe>`;

    return wrapEmbededHTML("youtube", iframe);
  },
};

const TwitterTransformer: Transformer = {
  name: "Twitter",
  shouldTransform(url) {
    const { host, pathname } = new URL(url);
    return host === "twitter.com" && /^\/[^/]+\/status\/\d+/.test(pathname);
  },
  async getHTML(url) {
    const requestUrl = new URL("https://publish.twitter.com/oembed");
    requestUrl.searchParams.append("url", url);
    requestUrl.searchParams.append("align", "center");
    requestUrl.searchParams.append("omit_script", "1");

    const response = await fetch(requestUrl);
    const json = await response.json();
    assert(typeof json === "object" && json !== null);
    assert(typeof json.html === "string");

    return wrapEmbededHTML("twitter", json.html);
  },
};

export default async function markdownToHtml(
  markdown: string
): Promise<{ html: string; twitter: boolean }> {
  const result = await unified()
    .use(remark)
    .use(remarkEmbedder, {
      transformers: [YouTubeTransformer, TwitterTransformer],
    })
    .use(remark2rehype)
    .use(html)
    .use(shiki)
    .process(markdown);

  const resultHTML = result.toString();
  const twitter = resultHTML.indexOf('data-embedded-media="twitter"') !== -1;

  return { html: resultHTML, twitter };
}

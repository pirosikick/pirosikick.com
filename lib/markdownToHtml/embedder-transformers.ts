import assert from "assert";
import { URL } from "url";
import { Transformer } from "@remark-embedder/core";
import fetch from "node-fetch";

const wrapEmbededHTML = (name: string, innerHTML: string) =>
  `<div data-embedded-media="${name}">${innerHTML}</div>`;

export const EmbedderYouTubeTransformer: Transformer = {
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

export const EmbedderTwitterTransformer: Transformer = {
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

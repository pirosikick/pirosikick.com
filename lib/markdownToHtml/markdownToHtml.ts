import unified from "unified";
import remark2rehype from "remark-rehype";
import remark from "remark-parse";
import html from "rehype-stringify";
import shiki from "rehype-shiki";
import remarkEmbedder from "@remark-embedder/core";
import {
  EmbedderSpeakerDeckTransformer,
  EmbedderTwitterTransformer,
  EmbedderYouTubeTransformer,
} from "./embedder-transformers";
import { allowImageOptions } from "./unified-plugins";
import { remark2rehypeHandlers } from "./remark2rehype-handlers";

export async function markdownToHtml(
  markdown: string
): Promise<{ html: string; twitter: boolean }> {
  const result = await unified()
    .use(remark)
    .use(remarkEmbedder, {
      transformers: [
        EmbedderYouTubeTransformer,
        EmbedderTwitterTransformer,
        EmbedderSpeakerDeckTransformer,
      ],
    })
    .use(allowImageOptions)
    .use(remark2rehype, {
      handlers: remark2rehypeHandlers,
    })
    .use(html)
    .use(shiki)
    .process(markdown);

  const resultHTML = result.toString();
  const twitter = resultHTML.indexOf('data-embedded-media="twitter"') !== -1;

  return { html: resultHTML, twitter };
}

import unified from "unified";
import remark2rehype from "remark-rehype";
import remark from "remark-parse";
import html from "rehype-stringify";
import shiki from "rehype-shiki";

export default async function markdownToHtml(
  markdown: string
): Promise<string> {
  const result = await unified()
    .use(remark)
    .use(remark2rehype)
    .use(html)
    .use(shiki)
    .process(markdown);

  return result.toString();
}

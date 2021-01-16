---
title: "シンタックスハイライトとOGPに対応した"
date: 1610682881
excerpt: "このブログがシンタックスハイライトとOGPに対応したので、その方法についてさくっと書きます。"

# coverImage: "/assets/syntax-highlight-and-ogp/some-image.jpg"
ogImage: "/assets/posts/syntax-highlight-and-ogp/og.jpeg"
---

このブログがシンタックスハイライトとOGPに対応したので、その方法についてさくっと書きます。

## シンタックスハイライト

このブログのベースになっている[Next.jsのblog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)のmarkdownをHTMLに変換する処理は、以下のようになっています。

```js
// markdownToHtml.js
import remark from 'remark'
import html from 'remark-html'

export default async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
```

これを、以下のように変更しました。

```ts
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
```

[remark-highlight.js](https://github.com/remarkjs/remark-highlight.js)というのもありましたが、[shiki](https://shiki.matsu.io/)がいいぞとどっかのブログに書いていたので、shikiを使いました。上記のコードは、以下のような流れです。

1. 文字列のmarkdownからremarkのASTへ(`remark-parse`)
2. remarkからrehypeのASTへ(`remark2rehype`)
3. ASTからHTML文字列へ(`remark-stringify`)
4. コードブロックをハイライト(`rehype-shiki`)

shikiのいいところは、生成後のHTMLにstyle属性を付けてハイライトしているので別途CSSファイル等を読み込む必要がないところです。
工夫した点としては、コードブロックに言語が指定されていない場合、`color: undefined`になってしまうので、CSS側でテーマに合わせてデフォルトの文字色を設定してあげるとよいです。

```css
.markdown pre > code {
  /* コードブロックに言語が指定されていない場合の文字色 */
  color: #ECEFF4;
  @apply text-sm bg-transparent p-0;
}
```

その他に、`rehype-shiki`のTypeScriptの型がなかったので追加するなどしました。気になる方はPRを見てみてください。

[Sourcecode highlight by pirosikick · Pull Request #17 · pirosikick/pirosikick.com](https://github.com/pirosikick/pirosikick.com/pull/17)

## OGP

OGPの設定に関しては「OGP 設定」で検索して表示されたブログを2, 3個を参考にして設定しただけなので、特に言うことはないです。Next.jsのblog-starterの時点である程度設定されていますが、トップと記事で挿入されるmetaタグをちょっと変えたくらいかな〜と思います。以下、設定したときのPRなので、興味があればどうぞ。

[add ogp by pirosikick · Pull Request #18 · pirosikick/pirosikick.com](https://github.com/pirosikick/pirosikick.com/pull/18)

`og:image`に設定する画像の生成は、フォトショなどの画像加工ツールを使って作るのもだるいな〜と思ったので、生成用のツールを作りました。`index.html`をブラウザで開いて、ブログのタイトルを入力するとOGP用の画像を生成します。

[https://github.com/pirosikick/pirosikick.com/tree/master/ogimage-maker](https://github.com/pirosikick/pirosikick.com/tree/master/ogimage-maker)

久々にcanvas要素を使ってゴニョゴニョしたので、楽しかったです。今は毎度手作業で上記のツールを使って生成していますが、ゆくゆくはPuppeteer等で自動生成できるといいな〜と思っています。

## おわり

それなりにブログっぽくなったかなと思います。あとは、Twitter埋め込みと画像貼り付けかな〜。



---
title: "このブログの作り方"
excerpt: "やっとブログを作ったので、その作り方をざっくりと書きます。"
date: 1609937105

# coverImage: "/assets/how-to-make-this-blog/some-image.jpg"
ogImage: "/assets/posts/how-to-make-this-blog/og.jpeg"
---

pirosikick.comはもともと、Gatsbyで「Hello, World」と表示されるだけのページで、いつかブログ作るか〜と思ってからはやN年経ってしまっていました。2021年こそはブログをいっぱい書くぞという気持ちになったので、年末年始の時間を使ってブログを投稿できる環境が整えました。

自作ブログの一本目はどんな感じでブログを作ったかを書くのが定番らしいので、ブログを作るまでにやったことを書きます。

## 1. create-next-app --example blog-starter

ブログを作ることに時間や手間を掛けすぎてしまいブログを書く元気がなくなりました、というのは避けたかったのでできる限り楽しようと決めていました。ということで、ブログのベースはNext.jsの[blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)を使いました。

```
# カレントディレクトリにblog-starterを展開
$ npx create-next-app --example blog-starter .

# localhost:3000に起動
$ npm run dev
```

## 2. blog-starterのTypeScript化

### 2.1. TypeScriptのインストール

「Next.js TypeScript」でググって1ページに表示された[公式の記事](https://nextjs.org/docs/basic-features/typescript)を参考にしました。空の`tsconfig.json`を作り、TypeScriptをインストール、`npm run dev`でサーバーを起動するとよしなに`tsconfig.json`を作成してくれて非常に楽でした。素晴らしいDX（Developer Experienceの方）だぜ。

```
# TypeScript、最低限の型をインストール
$ npm i -D typescript @types/react @types/node

# 空のtsconfig.jsonを作成
$ touch tsconfig.json

# 起動
$ npm run dev
```

ですが、生成された`tsconfig.json`は結構ゆるい設定なので、`noImplicitAny`、`strict`だけ`true`に変えました。

### 2.2. .js → .ts,.tsx

[その時のコミット](https://github.com/pirosikick/pirosikick.com/pull/8/commits/ad0841f4074ab091f546e481f823eaa3ef1dfe1f)

Reactコンポーネントの書き換えは簡単で、propsの型をひたすら追加するだけでした。propsのデータは複雑ではないので、単純作業です。
`lib/api.js`の書き換えは、ちょっと工夫しました。markdownファイルの先頭のYAML部分（Front Matterというらしい）を[`gray-matter`](https://www.npmjs.com/package/gray-matter)というnpmパッケージで取り出していますが、返り値が`any`です。これをTypeScriptのAssertion Functionで検証することで、`as 型`を使わずに適切な型を付けています。

```ts
// lib/api.tsを一部抜粋
import assert from 'assert';

function assertString(value: unknown, key: string): asserts value is string {
  assert(typeof value === "string", `${key} must be a string`);
  assert(value, `${key} is required`);
}

function assertNumber(value: unknown, key: string): asserts value is number {
  assert(typeof value === "number", `${key} must be a number`);
  assert(value, `${key} is required`);
}

function assertFrontMatter(
  data: Record<string, any>
): asserts data is FrontMatter {
  assertString(data.title, "title");
  assertNumber(data.date, "date");

  …以下、略…
}
```

`title`, `date`等は必須で、存在しなければ実行時にどこかしらでエラーが発生します（たぶん）。Assertion Functionを使うことで、必須パラメタの定義忘れをビルド時に検知することができます。

また、同じ`lib/api.ts`に定義されている`getPostBySlug`関数の型定義にちょっと苦労しましたが、以下の感じで定義できます。第2引数に渡したフィールド名によって返り値のオブジェクトに生えているフィールドが変わる、というやつです。

```ts
export function getPostBySlug<K extends keyof Post>(
  slug: string,
  fields: K[] = []
): Pick<Post, K> | null {
  …実装は省略…
}
```

## 3. ESLint & Prettierの導入

ESLint、Prettierを導入します。コミット時にフォーマットしてほしいので、lint-staged・huskeyもインストールしセットアップします。ESLintのルールは[サイボウズのやつ](https://github.com/cybozu/eslint-config)がよく整備されているので、それを使わせてもらいます。

```
# ESLint & Prettierのインストール
$ npm i -D eslint @cybozu/eslint-config prettier

# lint-staged, huskeyのインストール・セットアップ
$ npx mrm lint-staged
```

`.eslintrc.js`は以下です。Next.jsはJSXを記述するために`import React from 'react'`が不要なので、該当するESLintのルールを無効にしておきます（`react/jsx-uses-react`, `react/react-in-jsx-scope`）。

```js
// .eslintrc.js
module.exports = {
  extends: "@cybozu/eslint-config/presets/react-typescript-prettier",
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};
```

## 4. デプロイ周りの修正

Netlifyの設定は既に終わっていましたが、ビルドがNode.js v12以上でないできなかったので、`.node-version`を置いてビルド時のNode.jsのバージョンを指定するように変更しました。また、ビルドコマンド、公開ディレクトリの設定を`netlify.toml`で行うように修正しました。

その他にも細かいスタイルの追加などもやりました。興味があれば[リポジトリ](https://github.com/pirosikick/pirosikick.com)を見てみてください。

## TODO

適当に作ったので、以下がまだできていません。

- ソースコードのハイライト
- 一覧画面の生成
- 画像の最適化

ソースコードのハイライトは[shiki](https://shiki.matsu.io/)がよいらしいので、組み込んでみようと思っています。画像の最適化は、Next.jsをSSGにすると`next/image`が利用できないので別の方法で実装する必要があります。

その他にも足りてないものが色々あると思うので、ブログを書きながら修正していくぞい。

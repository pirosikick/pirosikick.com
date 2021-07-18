---
title: "@kintone/rest-api-clientをモックする"
date: 1626575888
excerpt: "@kintone/rest-api-clientをモックして単体テストを書く方法について、書いた"

# coverImage: "/assets/how-to-mock-kintone-rest-api-client/some-image.jpg"
ogImage: "/assets/how-to-mock-kintone-rest-api-client/og.jpg"
---

副業先でkintoneを利用している。kintoneの機能だけでは賄えない部分は、JSカスタマイズを作成し補っている。そのJSカスタマイズを作成するときに`@kintone/rest-api-client`を使うことが多く、単体テスト時はそれをモックしてテストする。今回は備忘録的に`@kintone/rest-api-client`をモックする方法について、書く。

## インスタンスは外から渡す

モックする方法について書く前に、モックしやすいインタフェースについて書く。

以下のように、関数内で`KintoneRestAPIClient`をインスタンス化するとテストしづらい。`jest.mock`はクラスでもモックできるが、`KintoneRestAPIClient`は`client.record.getRecord(...)`のようにプロパティを挟んでメソッドが生えているのでうまくモックされない。

```ts
const someFunction = () => {
  const client = new KintoneRestAPIClient();
  …
}
```

なので、インスタンスは外から渡す形に変える。JSカスタマイズのようにブラウザ上で`KintoneRestAPIClient`を使う場合、コンストラクタに何も渡す必要がないので、デフォルト引数でインスタンス化した`KintoneRestAPIClient`を渡すように書けばよい。そうすると、その関数を利用するときには`KintoneRestAPIClient`を意識する必要はないので、おすすめ。

```ts
interface SomeFunctionOptions {
  client: KintoneRestAPIClient;
}

const someFunction = ({
  client = new KintoneRestAPIClient(),
}: SomeFunctionOptions) => {
  …
};

// デフォルト引数でインスタンス化しているので、
// 利用するときにインスタンス化して渡す必要はない
someFunction({});
```

## jest.spyOnでモックする

注：jest前提なので、それ以外のテストフレームワークを使っている場合は同じような関数で読み替えてください

まず、テスト用に`KintoneRestAPIClient`をインスタンス化する。jest上で`KintoneRestAPIClient`を使う場合、Node環境になるので、`baseUrl`・`auth`をコンストラクタで渡す必要がある。が、モックすればその辺のパラメタはあまり関係なくなるので、適当な値を渡せばOK。

```ts
// jestはNode環境なので、
// コンストラクタに色々渡す必要がある
// baseUrl、authが必須になるが、どうせモックするので適当な値でOK
const client = new KintoneRestAPIClient({
  baseUrl: "https://example.cybozu.com/k",
  auth: {
    username: "hoge",
    password: "hoge",
  },
});
```

次に、モックしたいメソッドだけ`jest.spyOn`でモックする。TypeScript環境の場合、返り値の型など効くようになって、便利だった気がする。直後に`beforeEach`を定義して`mockClear`しておくと、`mockClear`忘れでテストが不安定になるのを防ぐことができるので、安心。

```ts
// モックしたいメソッドだけjest.spyOnする
const getRecordsMock = jest.spyOn(client.record, 'getRecords');

// beforeEachでmockClearする
beforeEach(() => {
  getRecordsMock.mockClear();
});
```

あとは、`mockResolvedValue`や`mockRejectedValue`で返り値をテストしたい形に書き換えたり、`expect(mock).toHaveBeenCalledWith`などで想定通りに呼んでいるかをテストすればよい。

```ts
test('…', async () => {
  getRecordsMock.mockResolvedValue({
    records: [],
    totalCount: "0"
  });

  await someFunction({ client });

  expect(getRecordsMock).toHaveBeenCalledWith({ … });
});
```

## おわり

JSカスタマイズでもテスト書いていきの気持ちでやっていこうな。

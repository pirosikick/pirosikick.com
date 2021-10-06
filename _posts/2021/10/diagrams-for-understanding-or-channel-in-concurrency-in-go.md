---
title: "Go言語による並行処理「4.4 orチャネル」の図"
date: 1633530670
excerpt: "コードを読んでも理解できなかったので図にしました。"

# coverImage: "/assets/diagrams-for-understanding-or-channel-in-concurrency-in-go/some-image.jpg"
ogImage: "/assets/posts/diagrams-for-understanding-or-channel-in-concurrency-in-go/og.jpeg"
---

今、[Go言語による並行処理（オライリー）](https://www.oreilly.co.jp/books/9784873118468/)を読んでいる。「4章 Goでの並行処理パターン」の中で「orチャネル」という関数が登場する。JavaScriptでいうところの`Promise.race`みたいなもので、複数のdoneチャネルを1つのチャネルにまとめ、doneチャネル郡の中でどれかがcloseされたらまとめたチャネルもcloseする、というような関数。

この関数は再帰処理で実装されており、コードを読んでいると混乱してきたので、理解できるように図を作った。それが以下。

https://speakerdeck.com/pirosikick/goyan-yu-niyorubing-xing-chu-li-4-dot-4-ortiyaneru-falsetu

再帰呼び出し時に、doneチャネルだけでなく、呼び出し側の`orDone`チャネル（複数のdoneチャネルをまとめたチャネル）も渡していて、これが理解できなかった。

```go
select {
case channel[0]:
case channel[1]:
case channel[2]:
// この行、なぜorDoneも渡しているの？🤔
case or(append(channels[3:], orDone)...):
}
```

本ではこの部分について、以下のように説明している。

「またorDoneチャネルも渡して、木構造の上位の部分が終了したら下位の部分も終了するようにしています。」

全くそのとおりなのだが、図を書いてやっと理解できたのでスッキリした。

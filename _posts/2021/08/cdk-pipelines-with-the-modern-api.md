---
title: "CDK Pipelinesの新しいAPIでマルチアカウントのCI/CD"
date: 1628054419
excerpt: "CDK Pipelinesの新しいAPIでマルチアカウントのCI/CDを構築する話です。"

ogImage: "/assets/posts/cdk-pipelines-with-the-modern-api/og.jpg"
---

副業先でAWS CDKを使ってアプリケーションのプロビジョニングを実行している。最近、副業先でControlTowerを導入したので、マルチアカウント環境＋AWS CDKでCI/CD環境を構築する方法について調べていたところ、以下の神記事を見つけた。

[CDK Pipelines: AWS CDK アプリケーションの継続的デリバリ | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/)

俺のやりたかったことが全て書いてあるぞ！と思ったが、実際に手元でコードを写経してみるとTypeScriptがエラーを吐く。調べてみると、上記記事は1年前くらいのもので、CDK Pipelinesの前世代のAPI（the original API）を使っているらしい。今は新しいAPI（the modern API）の使用が推奨されており、写経する上で記事のコードを少し変える必要があったので、変更箇所をまとめる。

※変更点しか書いていないので、上記の記事を先に読んだほうがよいと思います。

## CodePipelineを使う

記事では`CdkPipeline`コンストラクタを使っているが、新しいAPIでは`CodePipeline`コンストラクタを使う。

```ts
// 旧
const pipeline = new CdkPipeline(this, 'Pipeline', { … });

// 新
const pipeline = new CodePipeline(this, 'Pipeline', { … });
```

`CdkPipeline`コンストラクタの`synthAction`は、`CodePipeline`では`synth`になっている。また、そこには、`ShellStep`クラスのインスタンスを渡す。

```ts
// 旧
const pipeline = new CdkPipeline(this, 'Pipeline', {
	…,
	synthAction: SimpleSynthAction.standardNpmSynth({
		sourceArtifact,
		cloudAssemblyArtifact,
		buildCommand: 'npm run build'
	})
	…,
});

// 新
const pipeline = new CodePipeline(this, 'Pipeline', {
	synth: new ShellStep("Synth", {
		input: …後述…,
		commands: ["npm ci", "npm run build", "npx cdk synth"],
	}),
});
```

ちなみに、`ShellStep`クラスは色んなとこで使う（例えば、`pipeline.addStage`の`pre` or `post`など）。また、CDK Pipelinesは、`ShellStep`クラスのインスタンスごとにCodeBuildのプロジェクトを生成する。

## GitHubとの接続

新しいAPIでGitHubとOAuthのアクセストークンを使って接続するには、`CodePipelineSource.gitHub`関数を使う。`Artifact`インスタンスが不要になったので、古いAPIより少しシンプルになった。

```ts
// 旧
const pipeline = new CdkPipeline(this, 'Pipeline', {
	…,
	sourceAction: new codepipeline_actions.GithubSourceAction({
		actionName: 'GitHub',
		output: sourceArtifact,
		oauthToke: SecretValue.secretsManager('github-token'),
		owner: 'OWNER',
		repo: 'REPO',
	}),
	…,
});

// 新
const pipeline = new CodePipeline(this, 'Pipeline', {
	synth: new ShellStep("Synth", {
		input: CodePipelineSource.gitHub('OWNER/REPO', 'ブランチ名', {
			authentication: SecretValue.secretsManager('github-token'), // optional
		}),
		commands: ["npm ci", "npm run build", "npx cdk synth"],
	}),
	…,
});
```

[ドキュメント](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html#codepipeline-sources)を読むと、AWSコンソールでGitHub（または、その他のリポジトリサービス）との接続を作成・利用する方式が推奨されている。接続の作成は、AWSコンソール＞CodePipelineのコンソール＞左メニューの設定＞接続から行える。接続を作成するとARNがAWSコンソールに表示されるので、それをコピーして使う。

```ts
const pipeline = new CodePipeline(this, 'Pipeline', {
	synth: new ShellStep("Synth", {
		input: CodePipelineSource.connection('org/repo', 'branch', {
			connectionArn: '接続のARN',
		}),
		…,
	}),
	…,
});
```

## ブートストラップ

CDK Pipelinesでは、新しいブートストラップスタックが必要。`cdk.json`に`"@aws-cdk/core:newStyleStackSynthesis": true`があり、かつ、`cdk.json`があるディレクトリで`cdk bootstrap`を実行する場合は、自動で新しいブートストラップスタックを作成する。そうでない場合は、`CDK_NEW_BOOTSTRAP=1`を付けて`cdk bootstrap`を実行する必要がある。

```
$ env CDK_NEW_BOOTSTRAP=1 npx cdk bootstrap …
```

ちなみに、新しいブートストラップスタックはAWS CDK v2ではデフォルトになるらしい。

古いブートストラップスタックからの移行は[ここらへん](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html#migrating-from-old-bootstrap-stack)に書いてます。

## バケットの暗号化

Pipelineのアカウントとデプロイ先アカウントが別の場合、Artifactを置くS3バケットの暗号化が必須になる。`CodePipeline`コンストラクタに`crossAccountKeys: true`を付けると、暗号化が有効になる。

```ts
const pipeline = new CodePipeline(this, 'Pipeline', {
	input: …,
	crossAccountKeys: true,
});
```

## ステージの追加

ステージの追加は、`addApplicationStage`メソッドから`addStage`メソッドに変更になっている。引数に渡すのは`Stage`クラスのサブクラスという点は変わらない。

```ts
// 旧
pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'PreProd', {
  env: { account: 'ACCOUNT1', region: 'REGION' }
}));

// 新
pipeline.addStage(new CdkpipelinesDemoStage(this, 'PreProd', {
  env: { account: 'ACCOUNT1', region: 'REGION' }
}));
```

## 検証の追加

記事では、API GatewayのエンドポイントのURLに対して`curl`コマンドを実行する検証のステージを`pipeline.addActions`メソッドで追加している。

```ts
// 旧
const preprod = new CdkpipelinesDemoStage(this, 'PreProd', {
  env: { account: 'ACCOUNT1', region: 'us-east-2' }
});
const preprodStage = pipeline.addApplicationStage(preprod);
preprodStage.addActions(new ShellScriptAction({
  actionName: 'TestService',
  useOutputs: {
    ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput),
  },
  commands: [
    'curl -Ssf $ENDPOINT_URL',
  ],
}));
```

新しいAPIでは、`pipeline.addStage`メソッドの第2引数にオプションとして渡せるようになっている。以下のコードでは、`post`でステージ実行後の処理（`curl`コマンドの実行）を記述している。

```ts
// 新
const prod = new CdkpipelinesDemoStage(this, "PreProd", {
  env: { account: 'ACCOUNT1', region: 'REGION' },
});

pipeline.addStage(prod, {
  post: [
    new ShellStep("PostPreProd", {
      envFromCfnOutputs: {
        ENDPOINT_URL: prod.urlOutput,
      },
      commands: ["curl -Ssf $ENDPOINT_URL"],
    }),
  ],
});
```

`pre`を使うことで、ステージ実行前の処理を追加することもできる。`pre`に`ManualApprovalStep`クラスのインスタンスを渡すと、ステージ実行前に手動による承認を挟むことができ、便利そう。

## おわり
新しいAPIのほうがシンプルで洗練されているし、ステージの並列実行もサポートしているらしい。CDK Pipelinesを使うとAWS CDKによるCI/CD環境を簡単に構築できて、最高〜。

## 参考資料
- [CDK PipelinesのREADME](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html)
	- [読んだときのメモ](https://zenn.dev/pirosikick/scraps/3a36570da18843)

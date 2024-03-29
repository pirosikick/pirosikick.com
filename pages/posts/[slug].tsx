import { useRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import PostFooter from "../../components/post-footer";
import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import PostTitle from "../../components/post-title";
import { SITE_NAME } from "../../lib/constants";
import { markdownToHtml } from "../../lib/markdownToHtml";

import type { GetStaticPaths, GetStaticProps } from "next";
import type { Post as PostType } from "../../lib/api";

export interface PostProps {
  post: Pick<
    PostType,
    | "title"
    | "excerpt"
    | "date"
    | "slug"
    | "author"
    | "content"
    | "ogImage"
    | "coverImage"
  >;
  twitter: boolean;
}

export default function Post({ post, twitter }: PostProps) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | {SITE_NAME}
                </title>
                <meta
                  property="og:url"
                  content={`https://pirosikick.com/posts/${post.slug}`}
                />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || ""} />
                <meta property="og:image" content={post.ogImage} />
                <meta property="twitter:card" content="summary_large_image" />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
              <PostFooter />
            </article>
            {twitter && (
              <script
                async
                defer
                src="https://platform.twitter.com/widgets.js"
              />
            )}
          </>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || typeof params.slug !== "string") {
    return { notFound: true };
  }

  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "excerpt",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  if (!post) {
    return { notFound: true };
  }

  const { html: content, twitter } = await markdownToHtml(post.content || "");
  return {
    props: {
      post: {
        ...post,
        content,
      },
      twitter,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};

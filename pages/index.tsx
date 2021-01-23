import Head from "next/head";
import Container from "../components/container";
import Layout from "../components/layout";
import DateFormatter from "../components/date-formatter";
import { getAllPosts } from "../lib/api";
import {
  BASE_URL,
  DEFAULT_OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/constants";

import type { Post } from "../lib/api";
import type { GetStaticProps } from "next";
import Link from "next/link";

export interface IndexProps {
  allPosts: Array<
    Pick<Post, "title" | "date" | "slug" | "author" | "coverImage" | "excerpt">
  >;
}

export default function Index({ allPosts }: IndexProps) {
  return (
    <>
      <Layout>
        <Head>
          <title>{SITE_NAME}</title>
          <meta property="og:url" content={BASE_URL} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={SITE_NAME} />
          <meta property="og:description" content={SITE_DESCRIPTION} />
          <meta property="og:image" content={DEFAULT_OG_IMAGE_URL} />
        </Head>
        <Container>
          <section className="pt-20 mb-20">
            <h1 className="lg:text-7xl text-4xl font-bold tracking-tighter leading-tight md:leading-none text-center">
              {SITE_NAME}
            </h1>
          </section>
          <section className="max-w-2xl mx-auto">
            {allPosts.map((post) => (
              <div key={`recent-post-${post.slug}`} className="mb-6">
                <h3 className="text-2xl mb-2 leading-snug">
                  <Link as={`/posts/${post.slug}`} href="/posts/[slug]">
                    <a className="underline">{post.title}</a>
                  </Link>
                </h3>
                <div className="text-sm mb-0.5">
                  <DateFormatter timestamp={post.date} />
                </div>
                <p className="text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            ))}
          </section>
        </Container>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);
  const props: IndexProps = { allPosts };
  return { props };
};

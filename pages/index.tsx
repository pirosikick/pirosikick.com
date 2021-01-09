import Head from "next/head";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import {
  BASE_URL,
  DEFAULT_OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/constants";

import type { Post } from "../lib/api";
import type { GetStaticProps } from "next";

export interface IndexProps {
  allPosts: Array<
    Pick<Post, "title" | "date" | "slug" | "author" | "coverImage" | "excerpt">
  >;
}

export default function Index({ allPosts }: IndexProps) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
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
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
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

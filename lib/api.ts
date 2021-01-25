import fs from "fs";
import assert from "assert";
import path from "path";
import { URL } from "url";
import matter from "gray-matter";
import globby from "globby";
import { BASE_URL, DEFAULT_OG_IMAGE_URL } from "./constants";

interface FrontMatter {
  title: string;
  date: number;
  excerpt: string | null;
  coverImage: string | null;
  author: {
    name: string;
    picture: string;
  } | null;
  ogImage: string | null;
}

export interface Post extends FrontMatter {
  slug: string;
  content: string;
  ogImage: string;
}

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

  for (const key of ["excerpt", "coverImage"]) {
    if (key in data) {
      assertString(data[key], key);
    }
  }

  if (data.author) {
    assert(typeof data.author === "object", "author must be an object");
    assertString(data.author.name, "author.name");
    assertString(data.author.picture, "author.picture");
  }

  if (data.ogImage) {
    assertString(data.ogImage, "ogImage");
  }
}

function getPostFiles(): string[] {
  return globby.sync([path.join(process.cwd(), "_posts/**/*.md")]);
}

export function getPostSlugs() {
  return getPostFiles().map((file) => path.basename(file, ".md"));
}

function getPost(file: string): Post | null {
  const slug = path.basename(file, ".md");

  let fileContents: string;
  try {
    fileContents = fs.readFileSync(file, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      return null;
    }
    throw err;
  }

  const { data, content } = matter(fileContents);
  assertFrontMatter(data);

  const ogImage: string = (() => {
    if (data.ogImage) {
      if (/^https:/.test(data.ogImage)) {
        return data.ogImage;
      }
      const url = new URL(BASE_URL);
      url.pathname = data.ogImage;
      return url.toString();
    }
    return data.coverImage || DEFAULT_OG_IMAGE_URL;
  })();

  return {
    ...data,
    ogImage,
    slug,
    content,
  };
}

function pick<K extends keyof Post>(
  post: Post,
  fields: K[] = []
): Pick<Post, K> {
  return fields.reduce((items, field) => {
    const value = typeof post[field] === "undefined" ? null : post[field];
    return { ...items, [field]: value };
  }, {} as Pick<Post, K>);
}

export function getPostBySlug<K extends keyof Post>(
  slug: string,
  fields: K[] = []
): Pick<Post, K> | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = getPostFiles().find(
    (file) => path.basename(file, ".md") === realSlug
  );
  if (!fullPath) {
    return null;
  }

  const post = getPost(fullPath);
  if (!post) {
    return null;
  }

  return pick(post, fields);
}

const extractNull = <T>(value: T): value is NonNullable<T> => value !== null;

export function getAllPosts<K extends keyof Post>(
  fields: K[] = []
): Array<Pick<Post, K>> {
  return (
    getPostFiles()
      .map((file) => getPost(file))
      .filter(extractNull)
      .map((post) => pick(post, fields))
      // sort posts by date in descending order
      // @ts-expect-error I have no idea to fix this error
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  );
}

import fs from "fs";
import assert from "assert";
import { join } from "path";
import matter from "gray-matter";

interface FrontMatter {
  title: string;
  date: number;
  excerpt: string | null;
  coverImage: string | null;
  author: {
    name: string;
    picture: string;
  } | null;
  ogImage: {
    url: string;
  } | null;
}

export interface Post extends FrontMatter {
  slug: string;
  content: string;
}

function isFrontMatterField(field: string): field is keyof FrontMatter {
  return [
    "title",
    "date",
    "excerpt",
    "coverImage",
    "author",
    "ogImage",
  ].includes(field);
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
    assert(typeof data.ogImage === "object", "ogImage must be an object");
    assertString(data.ogImage.url, "ogImage.url");
  }
}

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug<K extends keyof Post>(
  slug: string,
  fields: K[] = []
): Pick<Post, K> | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);

  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      return null;
    }
    throw err;
  }

  const { data, content } = matter(fileContents);
  assertFrontMatter(data);

  return fields.reduce((items, field) => {
    if (isFrontMatterField(field)) {
      const value = typeof data[field] === "undefined" ? null : data[field];
      return { ...items, [field]: value };
    } else if (field === "slug") {
      return { ...items, [field]: realSlug };
    } else if (field === "content") {
      return { ...items, [field]: content };
    }
    return items;
  }, {} as Pick<Post, K>);
}

const extractNull = <T>(value: T): value is NonNullable<T> => value !== null;

export function getAllPosts<K extends keyof Post>(
  fields: K[] = []
): Array<Pick<Post, K>> {
  const slugs = getPostSlugs();
  return (
    slugs
      .map((slug) => getPostBySlug(slug, fields))
      .filter(extractNull)
      // sort posts by date in descending order
      // @ts-expect-error I have no idea to fix this error
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  );
}

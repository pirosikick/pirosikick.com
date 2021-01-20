import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import PostTitle from "./post-title";
import { Post } from "../lib/api";

export interface PostHeaderProps
  extends Pick<Post, "title" | "coverImage" | "date" | "author"> {}

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
}: PostHeaderProps) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      {author && (
        <div className="hidden md:block md:mb-12">
          <Avatar name={author.name} picture={author.picture} />
        </div>
      )}
      {coverImage && (
        <div className="max-w-2xl mx-auto mb-8 md:mb-16">
          <CoverImage
            title={title}
            src={coverImage}
            width={1240}
            height={620}
          />
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        {author && (
          <div className="block md:hidden mb-6">
            <Avatar name={author.name} picture={author.picture} />
          </div>
        )}
        <div className="mb-6 text-lg">
          <DateFormatter timestamp={date} />
        </div>
      </div>
    </>
  );
}

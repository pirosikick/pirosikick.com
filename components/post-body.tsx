import markdownStyles from './markdown-styles.module.css'

export interface PostBodyProps {
  content: string;
}

export default function PostBody({ content }: PostBodyProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

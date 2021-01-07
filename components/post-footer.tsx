import styles from "./post-footer.module.css";

export default function PostFooter() {
  return (
    <div className={styles.postFooter}>
      <a href="/" className="">
        ← Back to top
      </a>
    </div>
  );
}

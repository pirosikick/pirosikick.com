import { useEffect } from "react";

const resizeSpeakerDeckIframe = () => {
  const iframes = document.querySelectorAll('iframe[src*="speakerdeck.com"]');
  iframes.forEach((ifm) => {
    if (!(ifm instanceof HTMLIFrameElement)) {
      return;
    }

    const w = parseInt(ifm.getAttribute("width") || "", 10);
    const h = parseInt(ifm.getAttribute("height") || "", 10);
    if (isNaN(w) || isNaN(h) || !ifm.parentElement) {
      return;
    }

    const parentWidth = ifm.parentElement.offsetWidth;
    ifm.style.width = "100%";
    ifm.style.height = `${parentWidth / (w / h)}px`;
  });
};

export interface PostBodyProps {
  content: string;
}

export default function PostBody({ content }: PostBodyProps) {
  useEffect(() => {
    resizeSpeakerDeckIframe();
    const onResize = () => resizeSpeakerDeckIframe();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [content]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="markdown" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

import type unified from "unified";

declare module "rehype-shiki" {
  interface ShikiSettings {
    theme?: string;
    useBackground?: boolean;
  }
  declare const shiki: (settings?: Settings) => unified.Transformer;
  export default shiki;
}

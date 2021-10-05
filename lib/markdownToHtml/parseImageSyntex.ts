interface ParseImageSyntaxResult {
  url: string;
  alt: string;
  title?: string;
  options?: Record<string, boolean | string>;
}

const parseOptionValue = (value: string | undefined): string | boolean => {
  if (typeof value === "undefined" || value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  }
  return value;
};

const IMAGE_SYNTAX_PATTERN = /^!\[([^\]])*\]\(([^)]*)\)$/;

export const isImageSyntax = (value: string): boolean =>
  IMAGE_SYNTAX_PATTERN.test(value);

export const parseImageSyntax = (value: string): ParseImageSyntaxResult => {
  if (!isImageSyntax(value)) {
    throw new Error("value isn't an image syntax");
  }

  const [url, ...rest] = RegExp.$2.split(/\s+/);
  const result: ParseImageSyntaxResult = {
    alt: RegExp.$1,
    url: url || "",
  };

  for (const chunk of rest) {
    if (chunk.match(/^"([^"]*)"$/) || chunk.match(/^'([^']*)'$/)) {
      result.title = RegExp.$1;
    } else {
      result.options = chunk.split("&").reduce((opts, kv) => {
        const [k, v] = kv.split("=");
        return {
          ...opts,
          [k]: parseOptionValue(v),
        };
      }, {});
    }
  }

  return result;
};

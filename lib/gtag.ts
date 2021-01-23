export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const pageview = (path: string) => {
  if (!GA_ID) {
    return;
  }

  gtag("config", GA_ID, {
    page_path: path,
  });
};

export const event = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  if (!GA_ID) {
    return;
  }

  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

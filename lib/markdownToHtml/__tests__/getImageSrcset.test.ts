import { getImageSrcset } from "../getImageSrcset";

const BASE = "https://res.cloudinary.com/pirosikick/image/upload";
const V = "v000000000";
const P = "a/b/c.jpg";

test.each([
  { url: "https://example.com/images/upload/hoge.jpg", expected: undefined },
  // without transformation options
  {
    url: `${BASE}/${V}/${P}`,
    expected: `${BASE}/c_limit,w_160/${V}/${P} 160w, ${BASE}/c_limit,w_320/${V}/${P} 320w`,
  },
  // with transformation options
  {
    url: `${BASE}/c_limit,w_160/${V}/${P}`,
    expected: `${BASE}/c_limit,w_160/${V}/${P} 160w, ${BASE}/c_limit,w_320/${V}/${P} 320w`,
  },
])("getImageSrcset($url) === $expected", ({ url, expected }) => {
  expect(getImageSrcset(url, [160, 320])).toBe(expected);
});

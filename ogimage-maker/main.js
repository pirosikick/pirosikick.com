const WIDTH = 1200;
const HEIGHT = 630;
const SCREEN_PADDING = 50;
const SITE_NAME_FONT_SIZE = 50;

const titleRect = {
  x: SCREEN_PADDING,
  y: SCREEN_PADDING,
  width: WIDTH - SCREEN_PADDING * 2,
  height: HEIGHT - SCREEN_PADDING * 2 - SITE_NAME_FONT_SIZE,
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawRuler = (ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = "gray";

  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();

  ctx.moveTo(0, HEIGHT / 2);
  ctx.lineTo(WIDTH, HEIGHT / 2);
  ctx.stroke();

  ctx.rect(
    SCREEN_PADDING,
    SCREEN_PADDING,
    WIDTH - SCREEN_PADDING * 2,
    HEIGHT - SCREEN_PADDING * 2
  );
  ctx.stroke();

  ctx.rect(titleRect.x, titleRect.y, titleRect.width, titleRect.height);
  ctx.stroke();

  ctx.moveTo(titleRect.x, titleRect.y + titleRect.height / 2);
  ctx.lineTo(titleRect.x + titleRect.width, titleRect.y + titleRect.height / 2);
  ctx.stroke();
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawSiteName = (ctx) => {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = `bold ${SITE_NAME_FONT_SIZE}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, system-ui, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
  ctx.textBaseline = "top";

  const text = "🍺👨🏻‍💻🍳 pirosikick.com";
  const textSize = ctx.measureText(text);
  // right bottom
  ctx.fillText(
    text,
    WIDTH - textSize.width - SCREEN_PADDING,
    HEIGHT - SITE_NAME_FONT_SIZE - SCREEN_PADDING
  );
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} title
 */
const drawTitle = (ctx, title) => {
  const texts = title.split("\n").slice(0, 3);
  const lineCount = texts.length;
  const fontSize = [100, 75, 50][lineCount - 1];
  const lineSpacing = fontSize / 4;
  const height = fontSize * lineCount + lineSpacing * (lineCount - 1);
  console.log(fontSize, height, lineCount);
  const startY = titleRect.y + titleRect.height / 2 - height / 2;

  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = `bold ${fontSize}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, system-ui, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
  ctx.textBaseline = "top";

  texts.forEach((text, i) => {
    const textSize = ctx.measureText(text);
    ctx.fillText(
      text,
      (WIDTH - textSize.width) / 2,
      startY + fontSize * i + lineSpacing * i
    );
  });
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} title
 */
const draw = (ctx, title) => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.beginPath();
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // drawRuler(ctx);
  drawTitle(ctx, title);
  drawSiteName(ctx);
};

const onLoad = () => {
  const canvas = document.querySelector("canvas");
  canvas.width = 1200;
  canvas.height = 630;

  const output = document.querySelector("#output");

  const ctx = canvas.getContext("2d");
  draw(ctx, "");

  const title = document.querySelector("#title");
  title.addEventListener("input", (e) => {
    draw(ctx, e.target.value);
  });

  const makeButton = document.querySelector("#make-button");
  makeButton.onclick = () => {
    const image = document.createElement("img");
    image.src = canvas.toDataURL("image/jpeg");

    const a = document.createElement("a");
    a.href = image.src;
    a.download = "og.jpeg";
    a.appendChild(image);

    output.appendChild(a);
  };
};
window.onload = onLoad;

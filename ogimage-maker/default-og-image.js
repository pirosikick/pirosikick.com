const WIDTH = 1200;
const HEIGHT = 630;

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const draw600x600Ruler = (ctx) => {
  ctx.beginPath();
  ctx.rect(300, 15, 600, 600);
  ctx.strokeStyle = "gray";
  ctx.stroke();
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawText = (ctx) => {
  const fontSize = 100;
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = `bold ${fontSize}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, system-ui, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
  ctx.textBaseline = "top";

  const text = "🍺👨🏻‍💻🍳 pirosikick.com";
  const textSize = ctx.measureText(text);
  ctx.fillText(text, (WIDTH - textSize.width) / 2, (HEIGHT - fontSize) / 2);
};

const onLoad = () => {
  const makeButton = document.querySelector("#make-button");

  const canvas = document.querySelector("canvas");
  canvas.width = 1200;
  canvas.height = 630;

  const output = document.querySelector("#output");

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // draw600x600Ruler(ctx);
  drawText(ctx);

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

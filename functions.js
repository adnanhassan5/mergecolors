
// Make sure to close the plugin when you're done. Otherwise the plugin will

var figmaStyles = getFigmaColorStyles();

// keep running, which shows the cancel button at the bottom of the screen.
export function hexToRgb(hexColor) {
  // Convert hexadecimal color to RGB
  const hex = hexColor.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}export function rgbToLab(rgbColor) {
  // Convert RGB color to CIELAB color space
  const [r, g, b] = rgbColor.map((x) => x / 255);
  const sR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  const X = sR * 0.4124564 + sG * 0.3575761 + sB * 0.1804375;
  const Y = sR * 0.2126729 + sG * 0.7151522 + sB * 0.072175;
  const Z = sR * 0.0193339 + sG * 0.119192 + sB * 0.9503041;
  const Xn = X / 0.95047;
  const Yn = Y / 1;
  const Zn = Z / 1.08883;
  const L = Y > 0.008856 ? 116 * Math.pow(Yn, 1 / 3) - 16 : 903.3 * Yn;
  const a = 500 * (Math.pow(Xn, 1 / 3) - Math.pow(Yn, 1 / 3));
  const cd = 200 * (Math.pow(Yn, 1 / 3) - Math.pow(Zn, 1 / 3));
  return [L, a, cd];
}
export function CheckColorDifference(color1, color2) {
  // Calculate Delta E (CIE76) between two colors
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const lab1 = rgbToLab(rgb1);
  const lab2 = rgbToLab(rgb2);
  const deltaL = lab1[0] - lab2[0];
  const deltaA = lab1[1] - lab2[1];
  const deltaB = lab1[2] - lab2[2];
  return Math.sqrt(
    Math.pow(deltaL, 2) + Math.pow(deltaA, 2) + Math.pow(deltaB, 2)
  );
}
// Function to convert RGB to hex
export function rgbToHex(color, opacity) {
    // console.log(color);
    //console.log(opacity)
    
    const r = Math.round(color.r * 255).toString(16);
    const g = Math.round(color.g * 255).toString(16);
    const b = Math.round(color.b * 255).toString(16);
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`.toUpperCase();
}
export function padZero(value) {
  return value.length === 1 ? `0${value}` : value;
}
export function getFigmaColorStyles() {
  // Get all the styles in the document
  const allStyles = figma.getLocalPaintStyles();

  // Filter out only color styles
  const colorStyles = allStyles.filter(
    (style) => style.paints[0].type === "SOLID"
  );
  return colorStyles;
}
export function assignStyleToStroke(node, styleId) {
  if ("strokes" in node) {
    // Assign the style to the stroke of the node
    node.strokeStyleId = styleId;
  }
}
export function assignStyleToFill(node, styleId) {
  if ("fills" in node) {
    // Assign the style to the fill of the node
    node.fillStyleId = styleId;
  }
}
export function comparebydifference(a, b) {
  return a.colordiff - b.colordiff;
}
export function getStyleId(hexColor, threshhold) {
  const foundStyle = [];
  if (hexColor) {
    let styleId;
    figmaStyles.forEach((style) => {
      const color = style.paints[0].color;

      const hexcolorstyle = rgbToHex(color,style.paints[0].opacity);

      //   console.log(hexColor + "  " + hexcolorstyle)
      const colordifference = CheckColorDifference(hexColor, hexcolorstyle);
      //   console.log("Color difference: " + colordifference)
      if (colordifference < threshhold) {
        // console.log("matching")
        styleId = style.id;
        const data = {
          style: styleId,
          colordiff: colordifference,
        };
        foundStyle.push(data);
      } else {
        // console.log("Not matching")
      }
    });
    foundStyle.sort(comparebydifference);
    console.log(foundStyle);
    if (foundStyle.length > 0) {
      return foundStyle[0].style;
    }
  } else {
    console.log("undefined hex code");
  }
}


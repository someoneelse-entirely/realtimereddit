export function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function rgbToHex(r, g, b) {
    return `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, "0")}`;
}

function parseColor(color) {
    if (color.startsWith("#")) {
        return hexToRgb(color);
    } else if (color.startsWith("rgb")) {
        return color.match(/\d+/g).map(Number);
    }
    throw new Error("Invalid color format");
}

export function contrastRatio(color1, color2) {
    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);

    const luminance1 = 0.2126 * Math.pow(r1 / 255, 2.2) + 0.7152 * Math.pow(g1 / 255, 2.2) + 0.0722 * Math.pow(b1 / 255, 2.2);
    const luminance2 = 0.2126 * Math.pow(r2 / 255, 2.2) + 0.7152 * Math.pow(g2 / 255, 2.2) + 0.0722 * Math.pow(b2 / 255, 2.2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
}

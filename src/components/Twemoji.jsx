import React from "react";
import twemoji from "twemoji";

const U200D = String.fromCharCode(0x200d);
const UFE0Fg = /\uFE0F/g;

function Twemoji({ emoji, ext = "svg", width = 16, height = 16 }) {
    const HEXCodePoint = twemoji.convert.toCodePoint(emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, "") : emoji);

    return <img className="emoji" src={`https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/${ext === "png" ? "72x72" : "svg"}/${HEXCodePoint}.${ext}`} width={width} height={height} alt={emoji} loading="lazy" draggable={false} />;
}

export default React.memo(Twemoji);

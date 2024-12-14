import { useState } from "react";

export default function LazyImage({ src, alt, className }) {
    const [, setLoaded] = useState(false);

    return <img src={src} alt={alt} className={className} onLoad={() => setLoaded(true)} />;
}

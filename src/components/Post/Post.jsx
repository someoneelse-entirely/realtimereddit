import React, { forwardRef, useState, Suspense, lazy } from "react";
import Twemoji from "../Twemoji";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import moment from "moment";
import { useLocalStorage } from "@uidotdev/usehooks";
// import Skeleton from "../Skeleton/Skeleton";

const LazyImage = lazy(() => import("../LazyImage"));

function replaceEmojisWithComponents(text) {
    const emojiRegex = /(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF]|[\u2600-\u26FF]\uFE0F?|\uD83C[\uDFF0-\uDFFF])/g;

    const parts = text.split(emojiRegex);
    const matches = text.match(emojiRegex) || [];

    const result = [];
    parts.forEach((part, index) => {
        if (part) result.push(part); // Add non-emoji text
        if (matches[index]) {
            result.push(<Twemoji key={`emoji-${index}`} emoji={matches[index]} />);
        }
    });

    return result;
}

function parsePostContent(text) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ children }) => {
                    return (
                        <p>
                            {React.Children.toArray(children).map((child, index) => {
                                if (typeof child === "string") {
                                    return replaceEmojisWithComponents(child);
                                }
                                return child;
                            })}
                        </p>
                    );
                },
                span: ({ children }) => {
                    return (
                        <span>
                            {React.Children.toArray(children).map((child, index) => {
                                if (typeof child === "string") {
                                    return replaceEmojisWithComponents(child);
                                }
                                return child;
                            })}
                        </span>
                    );
                },
                a: ({ children, href }) => {
                    return (
                        <a href={href} target="_blank" rel="noreferrer">
                            {children}
                        </a>
                    );
                },
            }}>
            {text}
        </ReactMarkdown>
    );
}

const Post = forwardRef(({ post }, ref) => {
    const [showImage, setShowImage] = useState(!post.over_18);
    const [{ showImages = true, timestampFormat = { value: "relative", label: "Relative" } }] = useLocalStorage("settings", {
        flair: [],
        showNSFW: false,
        playSound: true,
        volume: 75,
        posts: 10,
        showImages: true,
        timestampFormat: {
            value: "relative",
            label: "Relative",
        },
    });

    const isNSFW = post.over_18;

    return (
        <div className={`post ${isNSFW ? "nsfw" : ""}`.trim()} ref={ref}>
            <div className="header">
                <div>
                    <a href={`https://reddit.com/r/${post.subreddit}`} target="_blank" rel="noreferrer" style={{ marginRight: "0.5rem" }}>
                        r/{post.subreddit}
                    </a>
                    {post.link_flair_text && (
                        <span className={`flair ${post.link_flair_text_color === "dark" ? "flair-dark" : "flair-light"}`} style={{ backgroundColor: post.link_flair_background_color }}>
                            {post.link_flair_text}
                        </span>
                    )}
                    <a href={`https://reddit.com/user/${post.author}`} target="_blank" rel="noreferrer">
                        u/{post.author}
                    </a>
                </div>
                <span>{!timestampFormat?.value || timestampFormat?.value === "relative" ? moment.unix(post.created_utc).fromNow() : moment.unix(post.created_utc).format("h:mm A")}</span>
            </div>
            <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noreferrer" title={post.title}>
                <h2>{parsePostContent(post.title)}</h2>
            </a>
            <div className="content">
                {parsePostContent(post.selftext)}
                {showImages && post.preview && post.preview.images && post.preview.images[0] && post.preview.images[0].source && (
                    <a href={post.preview.images[0].source.url} target="_blank" rel="noreferrer">
                        <div style={{ position: "relative", display: "inline-block", borderRadius: "4px", overflow: "hidden", maxWidth: "100%", maxHeight: "33.333vh", objectFit: "cover" }}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <LazyImage src={post.preview.images[0].source.url} alt={post.title} className="thumbnail" />
                                {isNSFW && !showImage && (
                                    <div
                                        className="nsfw-overlay"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowImage(true);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "rgba(0, 0, 0,0.9)",
                                            color: "#fff",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            backdropFilter: "blur(50px)",
                                            zIndex: 2,
                                        }}>
                                        <span>Click to show image</span>
                                    </div>
                                )}
                            </Suspense>
                        </div>
                    </a>
                )}
            </div>
            <div className="footer">
                <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noreferrer">
                    {post.score} point{post.score !== 1 && "s"}
                </a>
                <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noreferrer">
                    {post.num_comments} comment{post.num_comments !== 1 && "s"}
                </a>
                {isNSFW && <span className="nsfw">NSFW</span>}
            </div>
        </div>
    );
});

export default Post;

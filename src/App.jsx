import { FaAnglesRight, FaGear, FaCheck, FaSquare } from "react-icons/fa6";
import ThemeSwitch from "./components/ThemeSwitch/ThemeSwitch";
import { useRef, useState, createRef, useMemo, useEffect } from "react";
import useAPI from "./hooks/useAPI";
import Post from "./components/Post/Post";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Drawer from "./components/Drawer/Drawer";
import { useLocalStorage } from "@uidotdev/usehooks";
import Select from "react-select";

function App() {
    const [subreddit, setSubreddit] = useState("Twitch");
    const subredditRef = useRef(null);
    const { data: posts, error: postsError } = useAPI(`https://www.reddit.com/r/${subreddit}/new.json?sort=new&raw_json=1`, {
        refetchInterval: 10000,
    });
    const flairs = useMemo(() => {
        return posts?.data?.children.reduce(
            (acc, post) => {
                if (post.data.link_flair_text && !acc.data.choices.find((x) => x.text === post.data.link_flair_text)) {
                    acc.data.choices.push({ text: post.data.link_flair_text, id: post.data.link_flair_css_class });
                }
                return acc;
            },
            { data: { choices: [] } }
        );
    }, [posts]);
    const postRefs = useRef([]);
    const [settings, setSettings] = useLocalStorage("settings", {
        flair: [],
        showNSFW: false,
        playSound: true,
        volume: 75,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [prevPosts, setPrevPosts] = useState([]);
    const [currentSubreddit, setCurrentSubreddit] = useState(subreddit);

    const filteredPosts = useMemo(() => {
        return posts?.data.children
            .filter((x) => {
                const hasValidText = x.data.selftext !== "[removed]" && x.data.selftext !== "[deleted]" && x.data.author !== "AutoModerator";
                const hasSelectedFlair = !settings.flair || settings.flair.length === 0 || settings.flair.includes(x.data.link_flair_text);
                const isNSFWAllowed = settings.showNSFW || !x.data.over_18;
                return hasValidText && hasSelectedFlair && isNSFWAllowed;
            })
            .sort((a, b) => b.data.created_utc - a.data.created_utc)
            .slice(0, 10);
    }, [posts, settings]);

    useEffect(() => {
        if (posts && posts.data.children.length > prevPosts.length && currentSubreddit === subreddit) {
            const audio = new Audio("newpost.mp3");
            audio.volume = (settings?.volume || 75) / 100;
            audio.play();
        }
        setPrevPosts(posts ? posts.data.children : []);
        setCurrentSubreddit(subreddit);
    }, [posts, subreddit, currentSubreddit]);

    return (
        <>
            <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <h2>Settings</h2>
                <h3>Flairs</h3>
                <Select
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: "light-dark(rgb(var(--primary-light)), rgb(var(--primary-dark)))",
                            primary25: "light-dark(rgb(var(--primary-light)), rgb(var(--primary-dark)))",
                            primary50: "light-dark(rgb(var(--primary-light)), rgb(var(--primary-dark)))",
                            neutral0: "transparent",
                            neutral5: "transparent",
                            neutral20: "light-dark(rgba(var(--text-light), 0.2), rgba(var(--text-dark), 0.2))",
                            neutral30: "light-dark(rgba(var(--text-light), 0.3), rgba(var(--text-dark), 0.3))",
                            neutral40: "light-dark(rgba(var(--text-light), 0.4), rgba(var(--text-dark), 0.4))",
                            neutral50: "light-dark(rgba(var(--text-light), 0.5), rgba(var(--text-dark), 0.5))",
                            neutral60: "light-dark(rgba(var(--text-light), 0.6), rgba(var(--text-dark), 0.6))",
                            neutral70: "light-dark(rgba(var(--text-light), 0.7), rgba(var(--text-dark), 0.7))",
                            neutral80: "light-dark(rgba(var(--text-light), 0.8), rgba(var(--text-dark), 0.8))",
                            neutral90: "light-dark(rgba(var(--text-light), 0.9), rgba(var(--text-dark), 0.9))",
                        },
                    })}
                    styles={{
                        multiValue: (styles) => {
                            return {
                                ...styles,
                                backgroundColor: "light-dark(rgb(var(--primary-light)), rgb(var(--primary-dark)))",
                                color: "rgb(var(--text-dark))",
                            };
                        },
                        multiValueLabel: (styles) => {
                            return {
                                ...styles,
                                color: "rgb(var(--text-dark))",
                            };
                        },
                        menu: (styles) => {
                            return {
                                ...styles,
                                backgroundColor: "light-dark(rgb(var(--background-light)), rgb(var(--background-dark)))",
                                color: "rgb(var(--text-dark))",
                                border: "1px solid light-dark(rgba(var(--text-light), 0.2), rgba(var(--text-dark), 0.2))",
                            };
                        },
                    }}
                    options={flairs?.data.choices.map((x) => {
                        return { value: x.text, label: x.text };
                    })}
                    isMulti={true}
                    onChange={(selected) => {
                        setSettings({ ...settings, flair: selected.map((x) => x.value) });
                    }}
                    defaultValue={settings.flair ? settings.flair.map((x) => ({ value: x, label: x })) : []}
                />
                <h3>NSFW Posts</h3>
                <input type="checkbox" checked={settings.showNSFW} onChange={(e) => setSettings({ ...settings, showNSFW: e.target.checked })} id="showNSFW" />
                <label htmlFor="showNSFW">Show NSFW posts</label>
                <h3>Notification Sounds</h3>
                <input type="checkbox" checked={settings.playSound} onChange={(e) => setSettings({ ...settings, playSound: e.target.checked })} id="playSound" />
                <label htmlFor="playSound">Play sound when new post is detected</label>
                <label htmlFor="volume">
                    <h4>Volume</h4>
                </label>
                <input type="range" min="0" max="100" step="1" defaultValue={settings?.volume || 75} id="volume" onChange={(e) => setSettings({ ...settings, volume: e.target.value })} />
                <p style={{ textAlign: "center" }}>{settings?.volume || 75}%</p>
            </Drawer>
            <header>
                <div className="control">
                    <input type="text" ref={subredditRef} placeholder="Enter subreddit (e.g. Twitch)" defaultValue={subreddit} onKeyUp={(e) => e.key === "Enter" && setSubreddit(subredditRef.current.value)} />
                    <button onClick={() => setSubreddit(subredditRef.current.value)}>
                        <FaAnglesRight />
                    </button>
                </div>
                <button className="button" onClick={() => setDrawerOpen(true)}>
                    <FaGear size={16} />
                </button>
                <ThemeSwitch />
            </header>
            <main>
                <div className="feed">
                    {postsError && <p>Error: {postsError.message}</p>}
                    <TransitionGroup>
                        {filteredPosts &&
                            filteredPosts.length > 0 &&
                            filteredPosts.map((post, index) => {
                                if (!postRefs.current[index]) {
                                    postRefs.current[index] = createRef();
                                }
                                return (
                                    <CSSTransition
                                        key={post.data.id}
                                        timeout={{
                                            enter: 500,
                                            exit: 250,
                                            appear: 500,
                                        }}
                                        classNames="post"
                                        in={true}
                                        nodeRef={postRefs.current[index]}>
                                        <Post post={post.data} ref={postRefs.current[index]} />
                                    </CSSTransition>
                                );
                            })}

                        {filteredPosts && filteredPosts.length === 0 && <p>No posts found.</p>}
                    </TransitionGroup>
                </div>
            </main>
            <footer>
                <p>
                    Made with <img className="emoji" src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/2764.svg" width="16" height="16" alt="❤" loading="lazy" draggable="false" /> by <a href="https://reddit.com/user/someoneelseentirely-">someoneelseentirely-</a>
                </p>
            </footer>
        </>
    );
}

export default App;

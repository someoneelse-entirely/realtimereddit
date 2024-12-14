import { useState } from "react";
import useAPI from "../hooks/useAPI";

export default function Changelog() {
    const { data, error } = useAPI("https://api.github.com/repos/someoneelse-entirely/realtimereddit/commits", {
        headers: {
            Accept: "application/vnd.github+json",
        },
    });

    const commitsByDate = data?.reduce((acc, commit) => {
        const date = new Date(commit.commit.author.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(commit);
        return acc;
    }, {});

    return (
        <>
            <h1>Changelog</h1>
            {error && <div>Failed to fetch changelog</div>}
            {commitsByDate && (
                <div style={{ overflowY: "auto" }}>
                    {Object.keys(commitsByDate).map((date) => (
                        <div key={date}>
                            <h2>{date}</h2>
                            <ul style={{ listStyleType: "initial", listStylePosition: "inside" }}>
                                {commitsByDate[date].map((commit) => (
                                    <CommitItem key={commit.sha} commit={commit} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

function CommitItem({ commit }) {
    const [expanded, setExpanded] = useState(false);
    const messageParts = commit.commit.message.split("\n\n");
    const title = messageParts[0];
    const description = messageParts.slice(1).join("\n\n");

    return (
        <li>
            <a href={commit.html_url} target="_blank" rel="noreferrer">
                {title}
            </a>
            {description && (
                <>
                    <button onClick={() => setExpanded(!expanded)}>{expanded ? "Show Less" : "Show More"}</button>
                    {expanded && (
                        <div style={{ whiteSpace: "pre-wrap", marginLeft: "2em" }}>
                            {description
                                .split("\n")
                                .filter((line) => line.trim() !== "")
                                .map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                        </div>
                    )}
                </>
            )}
        </li>
    );
}

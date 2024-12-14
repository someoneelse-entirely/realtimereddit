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
                                    <li key={commit.sha}>
                                        <a href={commit.html_url} target="_blank" rel="noreferrer">
                                            {commit.commit.message}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

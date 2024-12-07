import { useEffect, useState } from "react";

export default function useAPI(url, opts = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { refetchInterval } = opts;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch(url);
                const json = await response.json();
                setData(json);
                setError(null);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        if (refetchInterval && typeof refetchInterval === "number" && refetchInterval > 0) {
            const id = setInterval(fetchData, refetchInterval);
            return () => clearInterval(id);
        }
    }, [url, refetchInterval]);

    return { data, loading, error };
}

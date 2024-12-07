import * as Icons from "react-icons/fa";
import { useEffect } from "react";
import styles from "./ThemeSwitch.module.css";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function ThemeSwitch() {
    const [theme, setTheme] = useLocalStorage("theme", "dark");

    useEffect(() => {
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <button onClick={toggleTheme} className={styles.button}>
            {theme === "light" ? <Icons.FaSun size={16} /> : <Icons.FaMoon size={16} />}
        </button>
    );
}

import styles from "./Skeleton.module.css";

export default function Skeleton({ width, height, className }) {
    const aspectRatio = width / height;
    return (
            <div className={`${styles.skeleton} ${className}`} style={{ width, height }} />
    );
}

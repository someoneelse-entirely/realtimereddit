import React, { useEffect } from "react";
import styles from "./Modal.module.css";
import { FaX } from "react-icons/fa6";

export default function Modal({ isOpen, onClose, children, style }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div className={styles.backdrop} onClick={handleBackdropClick} style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }} />
            <div className={styles.modal} style={{ ...style, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FaX size={12} />
                </button>
                {children}
            </div>
        </>
    );
}

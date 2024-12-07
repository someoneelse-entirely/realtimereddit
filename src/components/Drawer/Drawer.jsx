import React, { useEffect } from "react";
import styles from "./Drawer.module.css";
import { FaX } from "react-icons/fa6";

const Drawer = ({ isOpen, onClose, direction = "left", children }) => {
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

    const drawerStyles = {
        transform: isOpen ? "translateX(0)" : `translateX(${direction === "left" ? "-100%" : "100%"})`,
    };

    return (
        <>
            <div className={styles.backdrop} onClick={handleBackdropClick} style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }} />
            <div className={styles.drawer} style={drawerStyles}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FaX size={12} />
                </button>
                {children}
            </div>
        </>
    );
};

export default Drawer;

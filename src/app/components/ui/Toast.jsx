"use client";
import { useState, useEffect } from "react";

/**
 * Toast message reusable
 * props: message, type (info/success/error), duration(ms)
 */
export default function Toast({ message, type = "info", duration = 3000 }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    const colors = { success: "#4caf50", error: "#f44336", info: "#2196f3" };

    return (
        <div style={{
            position: "fixed", bottom: "20px", right: "20px",
            padding: "10px 20px", color: "white", backgroundColor: colors[type],
            borderRadius: "4px", zIndex: 9999
        }}>
            {message}
        </div>
    );
}

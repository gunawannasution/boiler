"use client";

import { resetPassword } from "../../actions/authActions";
import { useState } from "react";

export default function ResetPasswordPage({ params }) {
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("token", params.token);

        const res = await resetPassword(formData);
        setMessage(res.message);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            <input name="password" type="password" placeholder="Password baru" required />
            <button>Reset</button>
            {message && <p>{message}</p>}
        </form>
    );
}

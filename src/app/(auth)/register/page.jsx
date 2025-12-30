"use client";

import { useState } from "react";
import { registerUser } from "../../actions/auth";
import { useRouter } from "next/navigation";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import Toast from "../../components/Toast";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState(null);
    const router = useRouter();

    async function handleRegister(e) {
        e.preventDefault();
        try {
            await registerUser({ name, email, password });
            setToast({ type: "success", text: "Register berhasil, silakan login" });
            setTimeout(() => router.push("/login"), 1500);
        } catch (err) {
            setToast({ type: "error", text: err.message });
        }
    }

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
                <h1>Register</h1>
                <FormInput placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <FormInput placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                <FormInput placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
                <Button type="submit">Register</Button>
            </form>
            {toast && <Toast message={toast.text} type={toast.type} />}
        </div>
    );
}

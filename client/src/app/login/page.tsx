"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { API_BASE_URL } from "@/lib/apiConfig";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState("");
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                const data = await res.json()
                login(data)
                router.push("/dashboard")
            } else {
                alert("Invalid credentials")
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-pink-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-pink-600 mb-2">Welcome Back</h1>
                    <p className="text-slate-500 text-sm">Log in to find your perfect life partner</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                        <Input 
                            type="email" 
                            placeholder="name@example.com" 
                            className="h-12 border-pink-100 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="h-12 border-pink-100 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-pink-200 active:scale-[0.98]">
                        Sign In
                    </Button>
                </form>
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 text-sm">
                        New to Smart Match? <span className="text-pink-600 font-bold cursor-pointer hover:underline" onClick={() => router.push("/register")}>Create Account</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, CheckCircle2, Users, Sparkles } from "lucide-react"

export default function Home() {
    const router = useRouter()
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-pink-50 to-white pt-20 pb-20">
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-bounce">
                    <Sparkles className="size-4" /> #1 Trusted Matrimony Site
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-800 tracking-tighter leading-none">
                    Find Your <span className="text-pink-600">Perfect Match</span> <br /> With Intelligence.
                </h1>
                
                <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Connecting hearts across India with smart matching technology. 
                    Join 5 million+ members and find 'The One' today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md shrink-0">
                    <Button 
                        size="lg" 
                        className="h-14 bg-pink-600 hover:bg-pink-700 text-white px-10 rounded-2xl font-bold text-lg shadow-xl shadow-pink-200 transition-all flex-1" 
                        onClick={() => router.push("/register")}
                    >
                        Get Started Free
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline" 
                        className="h-14 border-pink-200 text-pink-600 hover:bg-pink-50 px-10 rounded-2xl font-bold text-lg flex-1" 
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </Button>
                </div>

                <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-green-500" />
                        <span className="text-sm font-semibold uppercase tracking-widest">Verified Profiles</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-green-500" />
                        <span className="text-sm font-semibold uppercase tracking-widest">Privacy Protected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-green-500" />
                        <span className="text-sm font-semibold uppercase tracking-widest">100% Secure</span>
                    </div>
                </div>
            </main>

            {/* Simple Features Section */}
            <section className="py-20 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-3xl w-fit mx-auto shadow-lg border border-pink-50">
                            <Users className="size-8 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Massive Member Base</h3>
                        <p className="text-slate-500 text-sm">Millions of profiles updated daily across all communities.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-3xl w-fit mx-auto shadow-lg border border-pink-50">
                            <Heart className="size-8 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Smart Matching</h3>
                        <p className="text-slate-500 text-sm">Advanced AI algorithms to find compatibility that matters.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-3xl w-fit mx-auto shadow-lg border border-pink-50">
                            <Sparkles className="size-8 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Success Stories</h3>
                        <p className="text-slate-500 text-sm">Thousands of marriages happen every month through Smart Match.</p>
                    </div>
                </div>
            </section>

            <footer className="py-10 bg-white text-center border-t border-slate-50">
                <p className="text-slate-400 text-xs font-medium tracking-tight">
                    Smart Match Matrimony • Made with ❤️ for India
                    <br />© 2026 Smart Match Inc.
                </p>
            </footer>
        </div>
    )
}

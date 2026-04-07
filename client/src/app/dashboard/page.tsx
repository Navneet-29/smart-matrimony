"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
    Users, 
    Bell, 
    LogOut, 
    MapPin, 
    User as UserIcon, 
    Heart, 
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    GraduationCap,
    Briefcase,
    IndianRupee
} from "lucide-react"

export default function DashboardPage() {
    const { user, loading, logout } = useAuth()
    const [matches, setMatches] = useState<any[]>([])
    const [notifications, setNotifications] = useState<any[]>([])
    const [showNotifs, setShowNotifs] = useState(false)
    const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'requests'>('all')
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) router.push("/login")
        if (user) {
            fetchMatches()
            fetchNotifications()
        }
    }, [user, loading])

    const fetchMatches = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/matches/suggested", {
                headers: { "token": `Bearer ${user?.accessToken}` }
            })
            const data = await res.json()
            if (Array.isArray(data)) setMatches(data)
        } catch (err) { console.error(err) }
    }

    const fetchNotifications = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/connections/notifications", {
                headers: { "token": `Bearer ${user?.accessToken}` }
            })
            const data = await res.json()
            if (Array.isArray(data)) setNotifications(data)
        } catch (err) { console.error(err) }
    }

    const handleAction = async (matchId: string, action: 'connect' | 'accept' | 'reject') => {
        try {
            const endpoint = action === 'connect' ? `request/${matchId}` : action === 'accept' ? `accept/${matchId}` : `reject/${matchId}`
            const res = await fetch(`http://localhost:5000/api/connections/${endpoint}`, {
                method: "POST",
                headers: { "token": `Bearer ${user?.accessToken}` }
            })
            if (res.ok) {
                fetchMatches()
                fetchNotifications()
            }
        } catch (err) { console.error(err) }
    }

    if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 text-pink-600 font-bold gap-4 animate-pulse">
        <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
        Finding your smart matches...
    </div>

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-pink-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center text-slate-800">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
                        <div className="bg-pink-600 p-1.5 rounded-lg">
                            <Heart className="text-white size-5 fill-white" />
                        </div>
                        <h1 className="text-2xl font-black text-pink-600 tracking-tighter">Smart Match</h1>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifs(!showNotifs)} 
                                className="p-2 hover:bg-pink-50 rounded-full transition-colors relative group"
                            >
                                <Bell className={`size-6 ${unreadCount > 0 ? 'text-pink-600' : 'text-slate-400'} group-hover:text-pink-600`} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-pink-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifs && (
                                <div className="absolute right-0 mt-3 w-80 bg-white border border-pink-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <h3 className="font-bold border-b border-pink-50 p-4 text-slate-800 bg-pink-50/30 flex justify-between items-center">
                                        Notifications
                                        <span className="text-[10px] text-pink-500 uppercase tracking-widest">Recent Activity</span>
                                    </h3>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-10 text-center text-slate-400 italic flex flex-col items-center gap-2">
                                                <Bell className="size-8 opacity-20" />
                                                <p className="text-sm">No new updates right now</p>
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n._id} className={`p-4 border-b border-pink-50 text-sm hover:bg-pink-50/30 transition-colors flex gap-3 ${!n.read ? 'bg-pink-50/10' : ''}`}>
                                                    <div className="bg-pink-100 p-2 rounded-full h-fit">
                                                        <UserIcon className="size-4 text-pink-600" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-slate-700 leading-tight">{n.message}</p>
                                                        <p className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <button className="w-full p-3 text-center text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors uppercase tracking-widest border-t border-pink-50">View All</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 leading-none">{user?.username}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Premium Member</p>
                            </div>
                            <div 
                                className="size-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => router.push("/onboarding")}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <button onClick={logout} className="p-2 hover:bg-red-50 rounded-full transition-colors group">
                                <LogOut className="size-5 text-slate-400 group-hover:text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sub-header Navigation */}
            <div className="bg-white border-b border-slate-100 shadow-sm overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 flex">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`py-4 px-6 text-sm font-bold tracking-tight transition-all border-b-2 whitespace-nowrap ${activeTab === 'all' ? 'border-pink-600 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Discovery
                    </button>
                    <button 
                        onClick={() => setActiveTab('requests')}
                        className={`py-4 px-6 text-sm font-bold tracking-tight transition-all border-b-2 whitespace-nowrap ${activeTab === 'requests' ? 'border-pink-600 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Pending Requests
                    </button>
                    <button 
                        onClick={() => setActiveTab('connected')}
                        className={`py-4 px-6 text-sm font-bold tracking-tight transition-all border-b-2 whitespace-nowrap ${activeTab === 'connected' ? 'border-pink-600 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        My Connections
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 w-full">
                {/* Search & Stats Bar */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Profiles for you</h2>
                        <p className="text-slate-500 text-sm mt-1">Found {matches.length} smart matches based on your preferences</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input type="text" placeholder="Search religion, city..." className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all" />
                        </div>
                        <Button variant="outline" className="h-10 rounded-xl border-slate-200 gap-2 font-bold text-xs"><Filter className="size-3" /> Filters</Button>
                    </div>
                </div>

                {/* Profiles Grid */}
                {matches.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-pink-200 shadow-xl flex flex-col items-center">
                        <div className="bg-pink-50 p-6 rounded-full mb-4">
                            <Users className="size-12 text-pink-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No matches found right now</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mt-2 mb-8">Try adjusting your preferences to see more amazing people around you.</p>
                        <Button onClick={() => router.push("/onboarding")} className="bg-pink-600 hover:bg-pink-700 px-8 h-12 rounded-xl font-bold shadow-lg">Update Preferences</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {matches.map((match) => (
                            <div key={match._id} className="group bg-white rounded-3xl shadow-xl border border-pink-50 overflow-hidden hover:shadow-2xl hover:shadow-pink-100 transition-all duration-300 flex flex-col">
                                <div className="h-64 relative overflow-hidden">
                                    {match.personalDetails?.profilePic ? (
                                        <img 
                                            src={match.personalDetails.profilePic} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            alt={match.username}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-7xl bg-gradient-to-br from-pink-50 to-rose-100 group-hover:scale-110 transition-transform duration-700">
                                            {match.personalDetails?.gender === 'Female' ? '👩' : '👨'}
                                            <p className="text-[10px] mt-2 text-pink-300 font-black uppercase tracking-widest">No Photo</p>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black border border-white/30 tracking-tighter shadow-sm">
                                        {match.matchScore || '95'}% MATCH
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                        <h3 className="text-lg font-black leading-tight">{match.personalDetails?.fullname || match.username}</h3>
                                        <div className="flex items-center gap-1 text-[10px] font-bold opacity-80 uppercase tracking-wider mt-1">
                                            <MapPin className="size-2.5" /> {match.personalDetails?.location || 'India'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        <div className="bg-pink-50 text-pink-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                            {match.personalDetails?.age || '25'} yrs
                                        </div>
                                        <div className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                            {match.personalDetails?.religion || 'Hindu'}
                                        </div>
                                        <div className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                            {match.personalDetails?.gender || 'Male'}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-start gap-2 text-xs text-slate-600">
                                            <GraduationCap className="size-3.5 mt-0.5 text-slate-400" />
                                            <span className="line-clamp-1">{match.education?.degree || 'Graduate'}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-xs text-slate-600">
                                            <Briefcase className="size-3.5 mt-0.5 text-slate-400" />
                                            <span className="line-clamp-1">{match.professional?.jobTitle || 'Private Job'}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-xs font-bold text-slate-800">
                                            <IndianRupee className="size-3.5 mt-0.5 text-pink-600" />
                                            <span>₹{match.professional?.income?.toLocaleString() || '12,00,000'}+ <span className="text-[10px] text-slate-400 font-normal">P.A.</span></span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-2">
                                        {match.connectionStatus === 'pending' ? (
                                            <Button disabled className="w-full bg-slate-100 text-slate-400 rounded-xl h-10 text-xs font-bold border-none">
                                                Request Sent
                                            </Button>
                                        ) : match.connectionStatus === 'accepted' ? (
                                            <Button className="w-full bg-green-50 text-green-600 border border-green-200 rounded-xl h-10 text-xs font-bold gap-2">
                                                <CheckCircle2 className="size-3" /> Connected
                                            </Button>
                                        ) : (
                                            <>
                                                <Button 
                                                    onClick={() => handleAction(match._id, 'reject')}
                                                    variant="outline" 
                                                    className="flex-1 h-10 rounded-xl border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 p-0 transition-all"
                                                >
                                                    <XCircle className="size-5" />
                                                </Button>
                                                <Button 
                                                    onClick={() => handleAction(match._id, 'connect')}
                                                    className="flex-[3] h-10 bg-pink-600 hover:bg-pink-700 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-pink-100 transition-all uppercase tracking-widest"
                                                >
                                                    Send Connect
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="mt-auto py-10 bg-white border-t border-slate-100 text-center">
                 <p className="text-slate-400 text-xs font-medium tracking-tight px-4">
                    Smart Match Matrimony - The future of finding love in India. 
                    <br />© 2026 Smart Match Inc. All rights reserved.
                 </p>
            </footer>
        </div>
    )
}

"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { User, GraduationCap, Briefcase, Heart, MapPin, Camera, ChevronRight, ChevronLeft } from "lucide-react"
import { API_BASE_URL } from "@/lib/apiConfig"

export default function OnboardingPage() {
    const { user, login, loading } = useAuth()
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        fullname: "", age: "", gender: "Male", religion: "", location: "", bio: "", profilePic: "",
        degree: "", field: "", jobTitle: "", income: "",
        preferredReligion: "", preferredEducation: "", preferredGender: "Female",
        preferredAgeMin: "20", preferredAgeMax: "40",
    })

    useEffect(() => {
        if (!loading && !user) router.push("/login")
        if (user?.personalDetails?.fullname) {
            setFormData(prev => ({
                ...prev,
                ...user.personalDetails,
                ...user.education,
                ...user.professional,
                ...user.preferences,
                age: user.personalDetails.age?.toString() || "",
                income: user.professional.income?.toString() || "",
                preferredAgeMin: user.preferences.preferredAgeMin?.toString() || "20",
                preferredAgeMax: user.preferences.preferredAgeMax?.toString() || "40",
            }))
        }
    }, [user, loading])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({ ...formData, profilePic: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async () => {
        if (!user) return
        const payload = {
            personalDetails: {
                fullname: formData.fullname,
                age: Number(formData.age),
                gender: formData.gender,
                religion: formData.religion,
                location: formData.location,
                bio: formData.bio,
                profilePic: formData.profilePic
            },
            education: { degree: formData.degree, field: formData.field },
            professional: { jobTitle: formData.jobTitle, income: Number(formData.income) },
            preferences: {
                preferredAgeMin: Number(formData.preferredAgeMin),
                preferredAgeMax: Number(formData.preferredAgeMax),
                preferredReligion: formData.preferredReligion,
                preferredEducation: formData.preferredEducation,
                preferredGender: formData.preferredGender,
            }
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                const data = await res.json()
                login({ ...user, ...data })
                router.push("/dashboard")
            }
        } catch (err) { console.error(err) }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-pink-50 text-pink-600 font-bold">Loading...</div>

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-10">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-pink-600 text-white shadow-lg' : 'bg-pink-100 text-pink-300'}`}>
                        {s}
                    </div>
                    {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-pink-600' : 'bg-pink-100'}`} />}
                </div>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen bg-pink-50 p-4 md:p-8 flex flex-col items-center">
            <h1 className="text-3xl font-black text-pink-600 mb-2 mt-4">Smart Match</h1>
            <p className="text-slate-500 mb-8 font-medium italic">Complete your profile to find beautiful connections</p>
            
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-pink-100">
                <StepIndicator />
                
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="flex items-center gap-2 mb-2">
                             <User className="text-pink-600 size-5" />
                             <h3 className="text-xl font-bold text-slate-800">Personal Basics</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                <Input placeholder="John Doe" value={formData.fullname} onChange={e => setFormData({...formData, fullname: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age</label>
                                <Input placeholder="25" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                                <select className="w-full h-12 border border-pink-50 bg-white p-2 rounded-xl focus:ring-pink-500 outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Religion</label>
                                <Input placeholder="Hindu / Muslim / Sikh / etc." value={formData.religion} onChange={e => setFormData({...formData, religion: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                <MapPin className="size-3" /> Location
                            </label>
                            <Input placeholder="Delhi, India" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Short Bio</label>
                            <textarea className="w-full border border-pink-50 p-4 rounded-2xl focus:ring-pink-500 outline-none min-h-32 text-sm" placeholder="Tell us something about your personality..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                        </div>

                        <div className="bg-pink-50 p-6 rounded-2xl border border-dashed border-pink-300">
                            <label className="flex items-center gap-2 font-bold text-pink-600 mb-3 text-sm cursor-pointer">
                                <Camera className="size-5" /> Profile Photo
                            </label>
                            <div className="flex items-center gap-4">
                                {formData.profilePic && <img src={formData.profilePic} className="w-16 h-16 rounded-full object-cover border-2 border-pink-600" />}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 cursor-pointer" />
                            </div>
                        </div>

                        <Button className="w-full h-14 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2" onClick={() => setStep(2)}>
                            Education & Career <ChevronRight className="size-5" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="flex items-center gap-2 mb-2">
                             <GraduationCap className="text-pink-600 size-5" />
                             <h3 className="text-xl font-bold text-slate-800">Education & Professional</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Highest Degree</label>
                            <Input placeholder="B.Tech, MBA, PhD, etc." value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                <Briefcase className="size-3" /> Job Title
                            </label>
                            <Input placeholder="Software Engineer / Doctor / Teacher" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Annual Income (₹)</label>
                            <Input placeholder="e.g. 1500000" type="number" value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" className="flex-1 h-14 border-pink-100 rounded-2xl font-bold flex items-center justify-center gap-2 text-pink-600" onClick={() => setStep(1)}>
                                <ChevronLeft className="size-5" /> Back
                            </Button>
                            <Button className="flex-2 w-2/3 h-14 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2" onClick={() => setStep(3)}>
                                Partner Preferences <ChevronRight className="size-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="flex items-center gap-2 mb-2">
                             <Heart className="text-pink-600 size-5" />
                             <h3 className="text-xl font-bold text-slate-800">Ideal Partner Preferences</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Min Age</label>
                                <Input type="number" value={formData.preferredAgeMin} onChange={e => setFormData({...formData, preferredAgeMin: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Max Age</label>
                                <Input type="number" value={formData.preferredAgeMax} onChange={e => setFormData({...formData, preferredAgeMax: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Preferred Religion</label>
                            <Input placeholder="e.g. Hindu" value={formData.preferredReligion} onChange={e => setFormData({...formData, preferredReligion: e.target.value})} className="h-12 rounded-xl focus:ring-pink-500 border-pink-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Looking For (Gender)</label>
                            <select className="w-full h-12 border border-pink-50 bg-white p-2 rounded-xl focus:ring-pink-500 outline-none" value={formData.preferredGender} onChange={e => setFormData({...formData, preferredGender: e.target.value})}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" className="flex-1 h-14 border-pink-100 rounded-2xl font-bold flex items-center justify-center gap-2 text-pink-600" onClick={() => setStep(2)}>
                                <ChevronLeft className="size-5" /> Back
                            </Button>
                            <Button className="flex-2 w-2/3 h-14 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-2xl shadow-xl transition-all" onClick={handleSubmit}>
                                Complete Profile & Start Searching
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            
            <p className="mt-10 text-slate-400 text-[10px] uppercase font-bold tracking-widest text-center">
                Trusted by 5 Million+ Indians • Smart Match 2026
            </p>
        </div>
    )
}

import React, { useState } from 'react';
import { X, Upload, Camera, Sparkles, Loader2 } from 'lucide-react';

const COMPANIES = ["Company A", "Company B", "Company C", "Company D", "Company E"];
const LOCATIONS = ["Location A", "Location B", "Location C", "Location D", "Location E"];
const CATEGORIES = ["Unsafe Action", "Unsafe Condition", "Safe Action", "Safe Condition", "Nearmiss"];
const HAZARD_TYPES = [
    "Tools & Equipment", "Lifting & Rigging", "Life Saving Rules", "Permit to Work",
    "Hazardous Substances", "Personal Protective Equipment", "Work Environment",
    "Work at Height", "Electrical Safety", "Fire Safety", "Manual Handling", "Excavation"
];

const CreateModal = ({ users, currentUser, onClose, onCreate, improveRecommendation, isGeneratingRecommendation, analyzePhoto, isAnalyzingPhoto, autofillFromDescription }) => {
    const [formData, setFormData] = useState({
        company: COMPANIES[0],
        location: LOCATIONS[0],
        category: CATEGORIES[0],
        subCategory: HAZARD_TYPES[0],
        description: '',
        recommendation: '',
        assignTo: users.length > 0 ? users[0].id : '',
        photo: null,
        document: null
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            if (name === 'photo') {
                const url = URL.createObjectURL(files[0]);
                setPreviewUrl(url);
            }
        }
    };

    const handleAIAnalyze = async () => {
        if (!formData.photo) return alert("Please upload a photo first!");
        const analysis = await analyzePhoto(formData.photo);
        if (analysis) {
            setFormData(prev => ({
                ...prev,
                company: analysis.company || prev.company,
                location: analysis.location || prev.location,
                category: analysis.category || prev.category,
                subCategory: analysis.subCategory || prev.subCategory,
                description: analysis.description || prev.description,
                recommendation: analysis.recommendation || prev.recommendation
            }));
        }
    };

    const handleAutofill = async () => {
        if (!formData.description) return alert("Please type a description first!");
        const analysis = await autofillFromDescription(formData.description);
        if (analysis) {
            setFormData(prev => ({
                ...prev,
                category: analysis.category || prev.category,
                subCategory: analysis.subCategory || prev.subCategory,
                recommendation: analysis.recommendation || prev.recommendation
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in py-4 sm:py-0 overflow-y-auto">
            <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl border border-[var(--border-color)] flex flex-col max-h-[95vh] transition-colors duration-300">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">New Observation</h3>
                    <button onClick={onClose} className="p-2 bg-[var(--bg-main)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">

                    {/* Description - NOW AT THE TOP */}
                    <div className="bg-[var(--bg-main)]/50 p-4 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-inner">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block">Observation Description</label>
                                <button
                                    type="button"
                                    onClick={handleAutofill}
                                    disabled={isGeneratingRecommendation}
                                    className="flex items-center gap-1.5 text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all disabled:opacity-50 uppercase tracking-tighter"
                                >
                                    {isGeneratingRecommendation ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    AI AUTOFILL
                                </button>
                            </div>
                            <textarea
                                name="description"
                                required
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none h-28 resize-none placeholder-slate-500 text-sm transition-all"
                                placeholder="What happened? Type here then click AI AUTOFILL..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block mb-2">Company</label>
                            <select name="company" value={formData.company} onChange={handleChange} className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] text-sm focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer">
                                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block mb-2">Location</label>
                            <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] text-sm focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer">
                                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] text-sm focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block mb-2">Hazard Type</label>
                            <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] text-sm focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer">
                                {HAZARD_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block">Recommendation</label>
                            <button
                                type="button"
                                onClick={async () => {
                                    const improved = await improveRecommendation(formData.description);
                                    if (improved) setFormData(prev => ({ ...prev, recommendation: improved }));
                                }}
                                disabled={isGeneratingRecommendation}
                                className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-all disabled:opacity-50 uppercase tracking-tighter"
                            >
                                {isGeneratingRecommendation ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                AI POLISH
                            </button>
                        </div>
                        <textarea
                            name="recommendation"
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none h-20 resize-none placeholder-slate-500 text-sm transition-all"
                            placeholder="Suggested corrective action..."
                            value={formData.recommendation}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block mb-2">Assign To</label>
                        <div className="relative">
                            <select
                                name="assignTo"
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-all appearance-none cursor-pointer"
                                value={formData.assignTo}
                                onChange={handleChange}
                            >
                                {users.filter(u => u.id !== currentUser.id).map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none text-xs">▼</div>
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block">Photo Evidence</label>
                                {formData.photo && (
                                    <button
                                        type="button"
                                        onClick={handleAIAnalyze}
                                        disabled={isAnalyzingPhoto}
                                        className="flex items-center gap-1.5 text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all disabled:opacity-50 uppercase tracking-tighter"
                                    >
                                        {isAnalyzingPhoto ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                        AI ANALYZE
                                    </button>
                                )}
                            </div>
                            <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 hover:bg-[var(--bg-main)] transition-all text-center cursor-pointer overflow-hidden h-32 flex flex-col items-center justify-center bg-[var(--input-bg)] group">
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <>
                                        <Camera className="text-blue-500 opacity-50 mb-2 group-hover:opacity-100 transition-opacity" size={24} />
                                        <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Tap to upload</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest block mb-2">Document (PDF)</label>
                            <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 hover:bg-[var(--bg-main)] transition-all text-center cursor-pointer overflow-hidden h-32 flex flex-col items-center justify-center bg-[var(--input-bg)] group">
                                <input
                                    type="file"
                                    name="document"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <Upload className="text-slate-500 opacity-50 mb-2 group-hover:opacity-100 transition-opacity" size={24} />
                                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter px-2 truncate w-full">
                                    {formData.document ? formData.document.name : "Tap to upload PDF"}
                                </span>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="mt-4 pt-4 border-t border-[var(--border-color)] shrink-0">
                    <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all uppercase tracking-widest">
                        Submit Report
                    </button>
                </div>
            </div>
        </div>

    );
};

export default CreateModal;

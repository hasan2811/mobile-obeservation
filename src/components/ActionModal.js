import React, { useState } from 'react';
import { X, Check, Camera, Loader2 } from 'lucide-react';

const ActionModal = ({ obs, onClose, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({
        notes: '',
        photo: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.notes) return alert("Please provide action notes!");
        onSubmit({
            timestamp: obs.raw?.timestamp || obs.id, // We need original timestamp to find row
            status: 'Pending', // Action taken usually moves to Pending for Review
            notes: formData.notes,
            photo: formData.photo
        });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 sm:p-0">
            <div className="bg-[var(--bg-card)] w-full max-w-md rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl relative overflow-hidden transition-colors duration-300">

                {/* Header */}
                <div className="p-6 pb-0 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">Take Action</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Complete the reported observation</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center justify-center hover:text-[var(--text-primary)] transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Notes */}
                    <div>
                        <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.2em] block mb-2">Completion Details</label>
                        <textarea
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none h-32 resize-none placeholder-slate-500 text-sm transition-all"
                            placeholder="Describe what you have done to fix this..."
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Proof Upload */}
                    <div>
                        <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-[0.2em] block mb-2">Proof of Completion</label>
                        <div className="relative group border-2 border-dashed border-[var(--border-color)] rounded-[2rem] p-4 bg-[var(--input-bg)] hover:bg-[var(--bg-main)] transition-all text-center cursor-pointer overflow-hidden h-48 flex flex-col items-center justify-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-3">
                                        <Camera className="text-blue-500" size={24} />
                                    </div>
                                    <span className="text-xs text-[var(--text-secondary)] font-bold">Capture or Upload Evidence</span>
                                    <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Required for verification</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.notes}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                Complete Task
                            </>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ActionModal;

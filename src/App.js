import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import AuthPage from './components/AuthPage';
import Dashboard from './views/Dashboard';
import Feed from './views/Feed';
import Tasks from './views/Tasks';
import Activity from './views/Activity';
import BottomNav from './components/BottomNav';
import CreateModal from './components/CreateModal';
import ReviewModal from './components/ReviewModal';
import DetailModal from './components/DetailModal';
import ActionModal from './components/ActionModal';
import Profile from './views/Profile';
import Toast from './components/Toast';
import SuccessCelebration from './components/SuccessCelebration';

const WEB_APP_URL = process.env.REACT_APP_WEB_APP_URL || "";
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-2.0-flash";


const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
  });
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [observations, setObservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, unsafe: 0, safe: 0, nearmiss: 0 });
  const [aiInsight, setAiInsight] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedObs, setSelectedObs] = useState(null); // For Detail View
  const [reviewModal, setReviewModal] = useState({ show: false, obsId: null });
  const [actionModal, setActionModal] = useState({ show: false, obs: null });

  // Feedback States
  const [toast, setToast] = useState(null); // { message, type }
  const [showSuccess, setShowSuccess] = useState(null); // String message
  const [loading, setLoading] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  // Theme State
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newVal = !prev;
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
      return newVal;
    });
  };

  // Sync with HTML class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [isDark]);

  // Initial Load
  useEffect(() => {
    if (user) {
      fetchFeed(1, false);
      fetchUsers();

      // Real-time Polling (Every 5 seconds for instant feel)
      const pollInterval = setInterval(() => {
        fetchFeed(1, false, true); // Silent refresh
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [user]);

  // --- API CALLS ---

  const fetchFeed = async (targetPage = 1, isAppending = false, silent = false) => {
    if (isAppending) setLoadingMore(true);
    else if (!silent) setLoading(true);

    try {
      const response = await fetch(`${WEB_APP_URL}?page=${targetPage}&limit=10`, { redirect: "follow" });
      const result = await response.json();

      let rawData = [];
      let newStats = null;
      let newHasMore = false;

      if (result.feed && Array.isArray(result.feed)) {
        rawData = result.feed;
        newStats = result.stats;
        newHasMore = result.hasMore;
      } else if (Array.isArray(result)) {
        rawData = result; // Legacy support
      }

      // Map backend data to UI format
      const mapped = rawData.map(item => ({
        id: item.timestamp, // Using timestamp as ID strictly for now
        title: item.category || 'Observation',
        description: item.description,
        recommendation: item.recommendation, // Map recommendation
        location: item.location,
        status: item.status || 'Open',
        creatorName: item.reportedBy || 'Unknown',
        assigneeName: item.assignTo || 'Unassigned',
        history: [
          { action: 'Created', timestamp: formatDate(item.timestamp), user: item.reportedBy },
          ...(item.actionNotes ? [{
            action: 'Action Taken',
            timestamp: formatDate(item.actionDate),
            user: item.actionBy,
            comment: item.actionNotes,
            proofUrl: item.proofUrl
          }] : []),
          ...(item.status === 'Closed' ? [{
            action: 'Closed',
            timestamp: 'Recent',
            user: item.reportedBy // Simplified
          }] : [])
        ],
        raw: item
      }));

      if (isAppending) {
        setObservations(prev => [...prev, ...mapped]);
      } else {
        setObservations(mapped);
      }

      if (newStats) setStats(newStats);
      setHasMore(newHasMore);
      setPage(targetPage);

    } catch (error) {
      console.error("Feed Error:", error);
      setToast({ message: "Failed to load feed", type: "error" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePageChange = (targetPage) => {
    if (targetPage > 0 && !loading && !loadingMore) {
      fetchFeed(targetPage, false); // Replace data, don't append
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'getUsers' }),
        redirect: 'follow'
      });
      const result = await response.json();
      if (result.users) {
        setUsers(result.users.map((u) => ({ id: u.username, name: u.username, ...u })));
      }
    } catch (error) {
      console.error("User Fetch Error:", error);
    }
  };

  const callGemini = async (prompt, systemInstruction = "", retries = 3, delay = 1000) => {
    try {
      const body = {
        contents: [{ parts: [{ text: prompt }] }]
      };

      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini Details:", errorData);

        // Handle Rate Limit (Too Many Requests)
        if (response.status === 429) {
          if (retries > 0) {
            console.warn(`Rate limit hit. Retrying in ${delay * 2}ms...`);
            await new Promise(r => setTimeout(r, delay * 2));
            return callGemini(prompt, systemInstruction, retries - 1, delay * 3);
          }
          throw new Error("RATE_LIMIT_EXCEEDED");
        }

        throw new Error(`API Error: ${response.status}`);
      }
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      if (error.message === "RATE_LIMIT_EXCEEDED") throw error;
      if (retries > 0) {
        await new Promise(r => setTimeout(r, delay));
        return callGemini(prompt, systemInstruction, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  const generateInsight = async (data) => {
    if (!data.length || isGeneratingInsight) return;
    setIsGeneratingInsight(true);
    try {
      const summary = data.map(d => `${d.category}: ${d.description}`).join('\n');
      const result = await callGemini(
        `Based on these reports, provide a 1-sentence executive safety summary: \n${summary}`,
        "You are an expert HSSE officer. Be concise and professional. Do not use markdown."
      );
      if (result) setAiInsight(result);
    } catch (e) {
      if (e.message === "RATE_LIMIT_EXCEEDED") {
        setToast({ message: "AI is busy. Please wait 1 minute.", type: "info" });
      } else {
        console.error("AI Insight Error", e);
      }
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const improveRecommendation = async (description) => {
    if (!description) {
      setToast({ message: "Fill description first!", type: "info" });
      return null;
    }
    setIsGeneratingRecommendation(true);
    try {
      const prompt = `Description: ${description}\nProvide a professional HSE recommendation in English (1 short paragraph). Focus on root cause and immediate action.`;
      const improved = await callGemini(prompt, "HSE Technical Writer");
      return improved?.trim();
    } catch (e) {
      if (e.message === "RATE_LIMIT_EXCEEDED") {
        setToast({ message: "AI Limit reached. Try again in 1 minute.", type: "info" });
      } else {
        setToast({ message: "AI Polish Failed", type: "error" });
      }
      return null;
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  const analyzePhoto = async (photoFile) => {
    if (!photoFile) return;
    setIsAnalyzingPhoto(true);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result.split(',')[1]);
        reader.readAsDataURL(photoFile);
      });
      const base64 = await base64Promise;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this image and provide HSE observation data in JSON format: { \"company\": \"string from choice [Company A, Company B, Company C, Company D, Company E]\", \"location\": \"string from [Location A..E]\", \"category\": \"string from [Unsafe Action, Unsafe Condition, Safe Action, Safe Condition, Nearmiss]\", \"subCategory\": \"string from [Tools & Equipment, Lifting & Rigging, Life Saving Rules, Permit to Work, Hazardous Substances, Personal Protective Equipment, Work Environment, Work at Height, Electrical Safety, Fire Safety, Manual Handling, Excavation]\", \"description\": \"concise description of what happened\", \"recommendation\": \"professional suggestion\" }. Only return the JSON block." },
              { inline_data: { mime_type: photoFile.type, data: base64 } }
            ]
          }]
        })
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      if (e.message === "RATE_LIMIT_EXCEEDED") {
        setToast({ message: "AI is resting. Please wait 1 minute.", type: "info" });
      } else {
        console.error("AI Analysis Error", e);
        setToast({ message: "AI Analysis Failed", type: "error" });
      }
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const autofillFromDescription = async (description) => {
    if (!description) {
      setToast({ message: "Type description first!", type: "info" });
      return;
    }
    setIsGeneratingRecommendation(true);

    try {
      const prompt = `Description: ${description}\nProvide HSE observation data in JSON format: { \"category\": \"string from [Unsafe Action, Unsafe Condition, Safe Action, Safe Condition, Nearmiss]\", \"subCategory\": \"string from [Tools & Equipment, Lifting & Rigging, Life Saving Rules, Permit to Work, Hazardous Substances, Personal Protective Equipment, Work Environment, Work at Height, Electrical Safety, Fire Safety, Manual Handling, Excavation]\", \"recommendation\": \"professional suggestion\" }. Only return the JSON block.`;
      const result = await callGemini(prompt, "HSE Assistant");
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setToast({ message: "AI Autofill Complete ✨", type: "success" });
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Autofill Error", e);
      setToast({ message: "AI Autofill Failed", type: "error" });
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  // --- ACTIONS ---

  const handleCreateObservation = async (formData) => {
    const { title, description, company, location, category, subCategory, recommendation, assignTo, photo, document } = formData;

    // Find assignee name
    const assignee = users.find(u => u.id === assignTo);

    // Prepare Base64 conversion promises if files exist
    const filePromises = [];
    if (photo) {
      filePromises.push(new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ type: 'foto', data: e.target.result.split(',')[1], mimeType: photo.type, name: photo.name });
        reader.readAsDataURL(photo);
      }));
    }
    if (document) {
      filePromises.push(new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ type: 'dokumen', data: e.target.result.split(',')[1], mimeType: document.type, name: document.name });
        reader.readAsDataURL(document);
      }));
    }

    const files = await Promise.all(filePromises); // Wait for file conversions

    // Extract files into individual fields for backend compatibility
    const foto = files.find(f => f.type === 'foto');
    const dokumen = files.find(f => f.type === 'dokumen');

    const payload = {
      action: 'submit',
      company,
      location,
      category, // Original category field
      subCategory,
      description,
      recommendation,
      assignTo: assignee ? assignee.username : '',
      reportedBy: user.username,
      timestamp: new Date().toISOString(),
      foto: foto || null,
      dokumen: dokumen || null
    };


    // Optimistic UI Update
    const previewUrl = photo ? URL.createObjectURL(photo) : null;
    const newObs = {
      id: payload.timestamp,
      title: category,
      description: description,
      status: 'Open',
      location: location,
      creatorName: user.username,
      assigneeName: assignee ? assignee.name : 'Unassigned',
      history: [{ action: 'Created', timestamp: 'Just now', user: user.username }],
      raw: { ...payload, fotoUrl: previewUrl } // Inject preview URL into raw data for display
    };


    setObservations([newObs, ...observations]);
    setShowCreateModal(false);
    setActiveTab('activity'); // Redirect to Activity tab to see their new post

    // Backend Call
    setIsSubmitting(true);
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      setShowSuccess("Your safety report has been recorded.");
      // Background refresh to get real ID/Url
      fetchFeed(1, false);
    } catch (e) {
      setToast({ message: "Saved locally, sync failed", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTakeAction = (obsId) => {
    const obs = observations.find(o => o.id === obsId);
    if (obs) setActionModal({ show: true, obs });
  };

  const handleActionSubmit = async ({ timestamp, status, notes, photo }) => {
    setActionModal({ show: false, obs: null });
    setLoading(true);
    setIsSubmitting(true);

    // OPTIMISTIC UPDATE: Update local state immediately
    setObservations(prev => prev.map(o => {
      if (o.id === timestamp) {
        return {
          ...o,
          status: 'Pending',
          history: [...o.history, {
            action: 'Action Taken (Syncing...)',
            timestamp: 'Just now',
            user: user.username,
            comment: notes
          }]
        };
      }
      return o;
    }));

    let proofPhotoData = null;
    if (photo) {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = (e) => resolve({
          data: e.target.result.split(',')[1],
          mimeType: photo.type,
          name: photo.name
        });
        reader.readAsDataURL(photo);
      });
      proofPhotoData = await base64Promise;
    }

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'updateTask',
          timestamp: timestamp,
          status: status,
          notes: notes,
          actionBy: user.username,
          proofPhoto: proofPhotoData
        }),
        redirect: 'follow'
      });
      fetchFeed(1, false); // Refresh to show the action in history
      setShowSuccess("Task completed successfully!");
    } catch (e) {
      console.error(e);
      setToast({ message: "Failed to update status", type: "error" });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async ({ action, comment, rating }) => {
    const obsId = reviewModal.obsId;
    const newStatus = action === 'close' ? 'Closed' : 'Open';

    // OPTIMISTIC UPDATE: Instant state change
    setObservations(prev => prev.map(o => {
      if (o.id === obsId) {
        return {
          ...o,
          status: newStatus,
          history: [...o.history, {
            action: action === 'close' ? 'Verified & Closed' : 'Reopened',
            timestamp: 'Just now',
            user: user.username,
            comment: comment || `Rating: ${rating} Stars`
          }]
        };
      }
      return o;
    }));

    setReviewModal({ show: false, obsId: null });
    // Also close the detail view if it was open for this item
    if (selectedObs && selectedObs.id === obsId) {
      setSelectedObs(null);
    }

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'updateTask',
          timestamp: obsId,
          status: newStatus,
          notes: comment ? `Review: ${comment} (Rating: ${rating})` : `Rated: ${rating} Stars`
        }),
        redirect: 'follow'
      });
      fetchFeed(1, false, true); // Silent refresh to update status
    } catch (e) { console.error(e); }
  };

  // --- RENDER ---

  if (!user) {
    return <AuthPage onLogin={setUser} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Filter Logic
  const myTasks = observations.filter(o => o.assigneeName === user?.username && o.status !== 'Closed');
  const myActivity = observations.filter(o => o.creatorName === user?.username);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[var(--bg-main)] shadow-2xl relative overflow-hidden transition-colors duration-300">
      {activeTab === 'dashboard' && (
        <Dashboard
          user={user}
          stats={stats}
          observations={observations}
          aiInsight={aiInsight}
          isGeneratingInsight={isGeneratingInsight}
          onGenerateInsight={() => generateInsight(observations)}
          onTaskClick={() => setActiveTab('tasks')}
          onActivityClick={() => setActiveTab('activity')}
          onFeedClick={() => setActiveTab('feed')}
          onProfileClick={() => setActiveTab('profile')}
        />
      )}

      {activeTab === 'profile' && (
        <Profile
          user={user}
          observations={observations}
          onLogout={() => {
            setUser(null);
            setActiveTab('dashboard');
          }}
          onBack={() => setActiveTab('dashboard')}
        />
      )}

      {activeTab === 'feed' && (
        <Feed
          feedData={observations}
          page={page}
          onPageChange={handlePageChange}
          hasMore={hasMore}
          loading={loading || loadingMore}
          onSelectObs={setSelectedObs}
        />
      )}

      {activeTab === 'tasks' && (
        <Tasks
          tasks={myTasks}
          onTakeAction={handleTakeAction}
        />
      )}

      {activeTab === 'activity' && (
        <Activity
          activity={myActivity}
          onReview={(id) => setReviewModal({ show: true, obsId: id })}
        />
      )}

      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onAddClick={() => setShowCreateModal(true)}
        pendingTasksCount={myTasks.filter(t => t.status === 'Open').length}
        reviewCount={myActivity.filter(t => t.status === 'Pending').length}
      />

      {showCreateModal && (
        <CreateModal
          users={users}
          currentUser={user}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateObservation}
          improveRecommendation={improveRecommendation}
          isGeneratingRecommendation={isGeneratingRecommendation}
          analyzePhoto={analyzePhoto}
          isAnalyzingPhoto={isAnalyzingPhoto}
          autofillFromDescription={autofillFromDescription}
        />
      )}

      {selectedObs && (
        <DetailModal
          obs={selectedObs}
          currentUser={user}
          onClose={() => setSelectedObs(null)}
          onTakeAction={(id) => {
            handleTakeAction(id);
            setSelectedObs(null);
          }}
          onReview={(id) => {
            // If reviewing from detail modal, close detail modal and open review modal
            setSelectedObs(null);
            setReviewModal({ show: true, obsId: id });
          }}
        />
      )}

      {reviewModal.show && (
        <ReviewModal
          onClose={() => setReviewModal({ show: false, obsId: null })}
          onSubmit={handleReviewSubmit}
        />
      )}

      {actionModal.show && (
        <ActionModal
          obs={actionModal.obs}
          onClose={() => setActionModal({ show: false, obs: null })}
          onSubmit={handleActionSubmit}
          isSubmitting={loading}
        />
      )}


      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showSuccess && (
        <SuccessCelebration
          message={showSuccess}
          onClose={() => setShowSuccess(null)}
        />
      )}

      {loading && !showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--bg-card)]/80 text-[var(--text-primary)] px-5 py-2.5 rounded-full flex items-center gap-2.5 text-xs backdrop-blur-md border border-[var(--border-color)] shadow-2xl transition-colors">
          <Loader2 size={14} className={`${isSubmitting ? 'animate-spin-fast text-blue-400' : 'animate-spin text-blue-500'}`} />
          <span className="font-black tracking-[0.2em] uppercase text-[9px] opacity-80">
            {isSubmitting ? 'Syncing Data' : 'Syncing System'}
          </span>
        </div>
      )}

    </div>
  );
}

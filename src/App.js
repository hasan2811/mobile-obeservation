import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Loader2, Bell, Download, RefreshCw } from 'lucide-react';
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
import { useOfflineQueue } from './utils/useOfflineQueue';
import { DashboardSkeleton, FeedSkeleton, TaskSkeleton } from './components/Skeleton';
import HSSELogo from './components/HSSELogo';
import {
  requestNotificationPermission,
  showLocalNotification,
  promptInstall,
  isPWAInstallable,
  isPWAInstalled,
  getPWALaunchIntent,
  getSharedMedia,
  applyServiceWorkerUpdate,
  registerBackgroundSync
} from './utils/pwaManager';

const WEB_APP_URL = process.env.REACT_APP_WEB_APP_URL || "";
const GEMINI_MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-2.0-flash";

// Helper function to get API key (prioritize user's key)
const getGeminiApiKey = () => {
  const userKey = localStorage.getItem('userGeminiKey');
  if (userKey && userKey.trim()) {
    return userKey.trim();
  }
  // Fallback to env key (for backward compatibility or admin override)
  return process.env.REACT_APP_GEMINI_API_KEY || "";
};



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
  const [isLive, setIsLive] = useState(false);
  const [newFeedCount, setNewFeedCount] = useState(0);
  const [inAppNotif, setInAppNotif] = useState(null);
  // PWA States
  const [pwaInstallable, setPwaInstallable] = useState(false);
  const [pwaUpdateAvailable, setPwaUpdateAvailable] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false); // for skeleton

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

  // Refs for smart polling
  const pollIntervalRef = React.useRef(null);
  const lastObsCountRef = React.useRef(0);

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

  // Smart Real-Time Polling
  const startPolling = React.useCallback((intervalMs = 3000) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = setInterval(async () => {
      if (document.visibilityState === 'hidden') return; // Skip when tab is hidden
      setIsLive(true);
      await fetchFeed(1, false, true); // Silent refresh
      // Flash live indicator then dim
      setTimeout(() => setIsLive(false), 800);
    }, intervalMs);
  }, []); // eslint-disable-line

  const stopPolling = React.useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Instant refresh after any action (with short delay for backend to process)
  const quickRefresh = React.useCallback((delayMs = 1200) => {
    setTimeout(() => fetchFeed(1, false, true), delayMs);
  }, []); // eslint-disable-line

  // Initial Load + Smart Polling + PWA Setup
  useEffect(() => {
    if (user) {
      fetchFeed(1, false).then(() => setInitialDataLoaded(true));
      fetchUsers();

      // Start polling at 3s interval
      startPolling(3000);

      // Page Visibility API
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchFeed(1, false, true);
          startPolling(3000);
        } else {
          startPolling(15000);
        }
      };
      const handleWindowFocus = () => fetchFeed(1, false, true);

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleWindowFocus);

      // PWA: Request notification permission after login
      setTimeout(() => requestNotificationPermission(), 3000);

      // PWA: Register Background Sync
      registerBackgroundSync();

      // PWA: Handle shortcuts from homescreen
      const intent = getPWALaunchIntent();
      if (intent?.action === 'create') setShowCreateModal(true);
      if (intent?.action === 'tab') setActiveTab(intent.tab);

      // PWA: Handle share target (foto dari galeri)
      if (getSharedMedia()) setShowCreateModal(true);

      // PWA: Background sync event dari Service Worker
      const handleBgSync = () => flushQueue?.();
      window.addEventListener('pwa-bg-sync', handleBgSync);

      return () => {
        stopPolling();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('pwa-bg-sync', handleBgSync);
      };
    }
  }, [user]); // eslint-disable-line

  // PWA: Install prompt & update listeners (mount once)
  useEffect(() => {
    const handleInstallable = () => setPwaInstallable(true);
    const handleInstalled = () => setPwaInstallable(false);
    const handleUpdate = () => setPwaUpdateAvailable(true);

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);
    window.addEventListener('pwa-update-available', handleUpdate);

    // Check if already installable at mount time
    if (isPWAInstallable()) setPwaInstallable(true);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
      window.removeEventListener('pwa-update-available', handleUpdate);
    };
  }, []);

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
        // Detect truly new items compared to current state (for badge)
        if (silent) {
          setObservations(prev => {
            const prevIds = new Set(prev.map(o => o.id));
            const genuinelyNew = mapped.filter(o => !prevIds.has(o.id));
            if (genuinelyNew.length > 0) {
              setNewFeedCount(c => c + genuinelyNew.length);
            }
            return mapped;
          });
        } else {
          setObservations(mapped);
        }
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

  const callGemini = async (prompt, systemInstruction = "", retries = 5, delay = 2000) => {
    const API_KEY = getGeminiApiKey();

    // Check if AI is enabled
    if (!API_KEY) {
      throw new Error("AI_DISABLED");
    }

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
            const nextDelay = delay * 2;
            console.warn(`Rate limit hit. Retrying in ${nextDelay}ms... (Retries left: ${retries})`);
            await new Promise(r => setTimeout(r, nextDelay));
            return callGemini(prompt, systemInstruction, retries - 1, nextDelay);
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
      if (e.message === "AI_DISABLED") {
        setToast({ message: "AI disabled. Add your Gemini API key in Profile → AI Settings.", type: "info" });
      } else if (e.message === "RATE_LIMIT_EXCEEDED") {
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
      if (e.message === "AI_DISABLED") {
        setToast({ message: "AI disabled. Add API key in Profile → AI Settings.", type: "info" });
      } else if (e.message === "RATE_LIMIT_EXCEEDED") {
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

    const API_KEY = getGeminiApiKey();
    if (!API_KEY) {
      setToast({ message: "AI disabled. Add API key in Profile → AI Settings.", type: "info" });
      return;
    }

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
      if (e.message === "AI_DISABLED") {
        setToast({ message: "AI disabled. Add API key in Profile → AI Settings.", type: "info" });
      } else {
        console.error("Autofill Error", e);
        setToast({ message: "AI Autofill Failed", type: "error" });
      }
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

    // Backend Call + Offline fallback
    setIsSubmitting(true);
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      setShowSuccess("Your safety report has been recorded.");
      quickRefresh(1200);
    } catch (e) {
      if (!navigator.onLine) {
        enqueue(payload);
      } else {
        setToast({ message: "Saved locally, sync failed", type: "error" });
      }
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
      setShowSuccess("Task completed successfully!");
      // Instant refresh after backend processes the action
      quickRefresh(1200);
    } catch (e) {
      console.error(e);
      setToast({ message: "Failed to update status", type: "error" });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (obs) => {
    try {
      setLoading(true);

      // OPTIMISTIC UPDATE: Remove from UI immediately
      setObservations(prev => prev.filter(o => o.id !== obs.id));
      setSelectedObs(null); // Close detail modal

      // Backend call to mark as deleted
      await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteObservation',
          timestamp: obs.raw?.timestamp
        }),
        redirect: 'follow'
      });

      setShowSuccess("Observation deleted successfully!");
      quickRefresh(1200); // Instant silent refresh
    } catch (e) {
      console.error("Delete Error:", e);
      setToast({ message: "Failed to delete observation", type: "error" });
      // Rollback: Reload data
      fetchFeed(1, false, true);
    } finally {
      setLoading(false);
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
      quickRefresh(1200); // Instant silent refresh
    } catch (e) { console.error(e); }
  };

  // Offline Queue integration
  const { queue: offlineQueue, isOnline, enqueue, flushQueue } = useOfflineQueue(
    WEB_APP_URL,
    () => quickRefresh(1000), // onSuccess callback
    setToast
  );

  // In-app notification for new tasks assigned to user
  const prevTaskCountRef = useRef(0);
  const prevReviewCountRef = useRef(0);
  useEffect(() => {
    if (!user) return;
    const myTasks = observations.filter(o => o.assigneeName === user.username && o.status === 'Open');
    const myReviews = observations.filter(o => o.creatorName === user.username && o.status === 'Pending');

    const newTasks = myTasks.length - prevTaskCountRef.current;
    const newReviews = myReviews.length - prevReviewCountRef.current;

    if (prevTaskCountRef.current > 0 && newTasks > 0) {
      setInAppNotif({ message: `${newTasks} new task${newTasks > 1 ? 's' : ''} assigned to you!`, type: 'task' });
      setTimeout(() => setInAppNotif(null), 4000);
    } else if (prevReviewCountRef.current > 0 && newReviews > 0) {
      setInAppNotif({ message: `${newReviews} report${newReviews > 1 ? 's' : ''} ready for review!`, type: 'review' });
      setTimeout(() => setInAppNotif(null), 4000);
    }

    prevTaskCountRef.current = myTasks.length;
    prevReviewCountRef.current = myReviews.length;
  }, [observations, user]); // eslint-disable-line

  // --- RENDER ---

  if (!user) {
    return <AuthPage onLogin={setUser} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Filter Logic
  const myTasks = observations.filter(o => o.assigneeName === user?.username && o.status !== 'Closed');
  const myActivity = observations.filter(o => o.creatorName === user?.username);

  // Skeleton: show while first data hasn't loaded
  const showSkeleton = !initialDataLoaded;

  // Tab label map
  const tabLabel = {
    dashboard: 'Dashboard',
    feed: 'Activity Feed',
    tasks: 'My Tasks',
    activity: 'My Reports',
    profile: 'Profile',
  };

  return (
    // True native mobile layout: flex column, full screen height
    <div
      className="max-w-md mx-auto bg-[var(--bg-main)] shadow-2xl transition-colors duration-300 flex flex-col"
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative' }}
    >
      {/* ─── PWA Update Banner (above header) ─── */}
      {pwaUpdateAvailable && (
        <div className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 flex items-center gap-3 z-[200]">
          <RefreshCw size={14} className="text-white animate-spin shrink-0" />
          <p className="text-xs font-bold text-white flex-1">New version available!</p>
          <button onClick={applyServiceWorkerUpdate} className="px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-wider rounded-xl">
            Update
          </button>
        </div>
      )}

      {/* ─── HEADER: Sticky top, always visible ─── */}
      {activeTab !== 'profile' && (
        <header
          className="shrink-0 flex items-center justify-between px-4 border-b border-[var(--border-color)] bg-[var(--bg-main)]/95 backdrop-blur-xl z-40 transition-colors duration-300 relative"
          style={{ height: '56px' }}
        >
          {/* Left: Logo + Brand name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, rgba(242,131,103,0.15), rgba(255,82,130,0.15))', border: '1px solid rgba(255,82,130,0.2)' }}>
              <HSSELogo size={20} />
            </div>
            <span className="text-[11px] font-black" style={{
              background: 'linear-gradient(135deg, #f28367, #ff5282)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.05em'
            }}>HSSE.Tech</span>
          </div>

          {/* Center: Tab name + LIVE dot */}
          <div className="flex flex-col items-center gap-0.5 absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-[0.1em]">
              {tabLabel[activeTab] || 'HSSE Tech'}
            </span>
            <div className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: isLive ? '#22c55e' : '#475569',
                  boxShadow: isLive ? '0 0 5px #22c55e' : 'none',
                }}
              />
              <span
                className="text-[8px] font-black uppercase tracking-widest transition-all duration-500"
                style={{ color: isLive ? '#22c55e' : '#475569', opacity: isLive ? 1 : 0.5 }}
              >
                {isLive ? 'LIVE' : 'Meram'}
              </span>
            </div>
          </div>

          {/* Right: Status indicators */}
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[8px] font-black text-amber-400 uppercase">Offline</span>
              </div>
            )}
            {loading && isSubmitting && (
              <Loader2 size={14} className="text-[#ff5282] animate-spin" />
            )}
          </div>
        </header>
      )}

      {/* ─── CONTENT AREA: Scrollable, fills remaining space ─── */}
      <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

        {/* In-App Notification Banner (inside scroll) */}
        {inAppNotif && (
          <div className="px-4 pt-3 animate-fade-in" onClick={() => setInAppNotif(null)}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border cursor-pointer ${inAppNotif.type === 'task'
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
              }`}>
              <Bell size={15} className={inAppNotif.type === 'task' ? 'text-blue-400' : 'text-amber-400'} />
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-wide ${inAppNotif.type === 'task' ? 'text-blue-400' : 'text-amber-400'
                  }`}>
                  {inAppNotif.type === 'task' ? 'New Task!' : 'Review Available!'}
                </p>
                <p className="text-xs text-[var(--text-primary)] font-medium">{inAppNotif.message}</p>
              </div>
              <div className={`w-1 h-7 rounded-full ${inAppNotif.type === 'task' ? 'bg-blue-500' : 'bg-amber-500'
                } animate-pulse`} />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          showSkeleton ? <DashboardSkeleton /> :
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
              setInitialDataLoaded(false);
            }}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'feed' && (
          showSkeleton ? <FeedSkeleton /> :
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
          showSkeleton ? <TaskSkeleton /> :
            <Tasks
              tasks={myTasks}
              onTakeAction={handleTakeAction}
              offlineQueue={offlineQueue}
              isOnline={isOnline}
              onRetryQueue={flushQueue}
            />
        )}

        {activeTab === 'activity' && (
          <Activity
            activity={myActivity}
            onReview={(id) => setReviewModal({ show: true, obsId: id })}
          />
        )}
      </main>

      {/* ─── BOTTOM NAV: Always at bottom, shrink-0 ─── */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab === 'feed') setNewFeedCount(0);
          setActiveTab(tab);
        }}
        onAddClick={() => setShowCreateModal(true)}
        pendingTasksCount={myTasks.filter(t => t.status === 'Open').length}
        reviewCount={myActivity.filter(t => t.status === 'Pending').length}
        newFeedCount={newFeedCount}
      />

      {/* ─── PWA Install Banner (above bottom nav) ─── */}
      {pwaInstallable && !isPWAInstalled() && (
        <div className="absolute bottom-[88px] left-3 right-3 z-[100] animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-indigo-500/30 shadow-2xl bg-[var(--bg-card)] backdrop-blur-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Download size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wide">Install HSSE Tech</p>
              <p className="text-[10px] text-[var(--text-secondary)] opacity-60">Pasang di homescreen</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setPwaInstallable(false)} className="text-[10px] text-[var(--text-secondary)] px-2 py-1.5 rounded-xl">
                Later
              </button>
              <button
                onClick={() => { promptInstall(); setPwaInstallable(false); }}
                className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODALS ─── */}
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
          onTakeAction={(id) => { handleTakeAction(id); setSelectedObs(null); }}
          onReview={(id) => { setSelectedObs(null); setReviewModal({ show: true, obsId: id }); }}
          onDelete={handleDelete}
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
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {showSuccess && (
        <SuccessCelebration message={showSuccess} onClose={() => setShowSuccess(null)} />
      )}

    </div>
  );
}

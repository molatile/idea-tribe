/**
 * Vanaj Cultural Archive - Cloud Feedback & Testimonial Service
 * Powered by Supabase Postgres with instant fallback to resilient local storage.
 * 
 * Features:
 * - Publicly visible feedback synchronized across all visitors and devices
 * - Real-time live updates via Supabase channels
 * - Seamless offline caching & graceful degradation if network or table is unavailable
 * - Browser-level ownership memory for edit & delete permissions
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { safeGet, safeSet } from '../utils/storage.js';

const MY_REVIEWS_KEY = 'vanaj_my_submitted_ids';
const FEEDBACK_CACHE_PREFIX = 'vanaj_feedback_cache_';
const LIKES_KEY_PREFIX = 'vanaj_likes_';

/**
 * Format timestamp or date string into human-friendly relative time
 */
export function formatReviewDate(dateStr, createdAt) {
  const dateToParse = createdAt || dateStr;
  if (!dateToParse) return 'Recently';

  // If already relative (e.g. "2 days ago", "Yesterday", "Just now")
  if (typeof dateToParse === 'string' && !dateToParse.includes('T') && !dateToParse.includes('-')) {
    return dateToParse;
  }

  const time = new Date(dateToParse);
  if (isNaN(time.getTime())) return typeof dateStr === 'string' ? dateStr : 'Recently';

  const diffMs = Date.now() - time.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) > 1 ? 's' : ''} ago`;

  return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Get IDs of reviews submitted by this browser
 */
export function getMySubmittedReviewIds() {
  const ids = safeGet(MY_REVIEWS_KEY, []) || [];
  return Array.isArray(ids) ? ids.map(String) : [];
}

/**
 * Record a review ID as belonging to this browser
 */
export function recordMyReviewId(id) {
  if (!id) return getMySubmittedReviewIds();
  const idStr = String(id);
  const existing = getMySubmittedReviewIds();
  if (!existing.includes(idStr)) {
    const updated = [idStr, ...existing];
    safeSet(MY_REVIEWS_KEY, updated);
    return updated;
  }
  return existing;
}

/**
 * Remove a review ID from local ownership list
 */
export function unrecordMyReviewId(id) {
  if (!id) return getMySubmittedReviewIds();
  const idStr = String(id);
  const existing = getMySubmittedReviewIds();
  const updated = existing.filter(i => i !== idStr);
  safeSet(MY_REVIEWS_KEY, updated);
  return updated;
}

/**
 * Check if a review was submitted by this browser.
 * Only returns true if the review ID was recorded as submitted by this browser.
 * Fixes critical vulnerability where any community review was treated as user-owned.
 */
export function isMyReview(id) {
  if (!id) return false;
  const myIds = getMySubmittedReviewIds();
  return myIds.includes(String(id));
}

/**
 * Get map of review likes tracked locally
 */
export function getStoredLikesMap(vertical) {
  return safeGet(`${LIKES_KEY_PREFIX}${vertical}`, {}) || {};
}

/**
 * Save updated likes map locally
 */
export function setStoredLikesMap(vertical, map) {
  safeSet(`${LIKES_KEY_PREFIX}${vertical}`, map);
}

/**
 * Normalizes a database row to the UI review format
 */
function normalizeCloudReview(row) {
  return {
    id: String(row.id),
    vertical: row.vertical,
    name: row.name,
    location: row.location,
    role: row.role || 'Cultural Patron',
    topic: row.topic || '',
    rating: Number(row.rating) || 5,
    date: formatReviewDate(null, row.created_at),
    createdAt: row.created_at,
    review: row.review,
    likes: Number(row.likes) || 0,
    recommended: Boolean(row.recommended),
    isUserSubmitted: Boolean(row.is_user_submitted),
    isEdited: Boolean(row.is_edited)
  };
}

/**
 * Fetch all feedback for a given vertical.
 * Tries Supabase first. If table is available, returns synchronized community feedback.
 * Automatically merges with default reviews and falls back to local storage cache on errors.
 */
export async function getVerticalFeedback(vertical, defaultReviews = []) {
  const cacheKey = `${FEEDBACK_CACHE_PREFIX}${vertical}`;
  const localCache = safeGet(cacheKey, null) || safeGet(`feedback_${vertical}`, null);

  if (!isSupabaseConfigured || !supabase) {
    const fallbackList = localCache && localCache.length > 0 ? localCache : defaultReviews;
    return {
      reviews: fallbackList,
      source: 'local',
      isCloud: false,
      error: 'Supabase credentials not configured in environment.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('vertical', vertical)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn(`[Supabase Feedback] Query returned notice for "${vertical}":`, error.message);
      // Fall back to local cache or defaults
      const fallbackList = localCache && localCache.length > 0 ? localCache : defaultReviews;
      return {
        reviews: fallbackList,
        source: 'local_fallback',
        isCloud: false,
        error: error.message
      };
    }

    // Cloud rows normalized
    const cloudReviews = (data || []).map(normalizeCloudReview);

    // Merge strategy:
    // 1. Cloud reviews submitted by users take precedence at the top.
    // 2. Default seeded reviews are included if not already present by ID.
    const cloudIds = new Set(cloudReviews.map(r => r.id));
    const merged = [...cloudReviews];

    for (const def of defaultReviews) {
      if (!cloudIds.has(def.id)) {
        merged.push({
          ...def,
          isUserSubmitted: false
        });
      }
    }

    // Update local cache for instant offline responsiveness
    safeSet(cacheKey, merged);

    return {
      reviews: merged,
      source: 'supabase',
      isCloud: true,
      error: null
    };
  } catch (err) {
    console.warn(`[Supabase Feedback] Fetch exception for "${vertical}":`, err);
    const fallbackList = localCache && localCache.length > 0 ? localCache : defaultReviews;
    return {
      reviews: fallbackList,
      source: 'local_fallback',
      isCloud: false,
      error: err.message
    };
  }
}

/**
 * Submit new feedback to Supabase so it is visible to everyone
 */
export async function submitCloudFeedback(vertical, reviewData, currentReviews = []) {
  const payload = {
    vertical,
    name: reviewData.name.trim(),
    location: reviewData.location.trim(),
    role: reviewData.role?.trim() || 'Cultural Patron',
    topic: reviewData.topic || '',
    rating: Math.min(5, Math.max(1, Number(reviewData.rating) || 5)),
    review: reviewData.review.trim(),
    likes: 0,
    recommended: reviewData.recommended ?? true,
    is_user_submitted: true
  };

  // Attempt Supabase insert if client configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        const normalized = normalizeCloudReview(data);
        normalized.isUserSubmitted = true;
        recordMyReviewId(normalized.id);

        const updatedList = [normalized, ...currentReviews.filter(r => r.id !== normalized.id)];
        safeSet(`${FEEDBACK_CACHE_PREFIX}${vertical}`, updatedList);

        return {
          success: true,
          review: normalized,
          updatedReviews: updatedList,
          isCloud: true
        };
      } else {
        console.warn('[Supabase Feedback] Insert notice, switching to resilient local save:', error?.message);
      }
    } catch (err) {
      console.warn('[Supabase Feedback] Insert exception, switching to resilient local save:', err);
    }
  }

  // Graceful local fallback if Supabase not ready or table missing
  const localItem = {
    id: `usr_${Date.now()}`,
    vertical,
    ...payload,
    date: 'Just now',
    createdAt: new Date().toISOString(),
    isUserSubmitted: true
  };

  recordMyReviewId(localItem.id);
  const updatedList = [localItem, ...currentReviews];
  safeSet(`${FEEDBACK_CACHE_PREFIX}${vertical}`, updatedList);
  safeSet(`feedback_${vertical}`, updatedList);

  return {
    success: true,
    review: localItem,
    updatedReviews: updatedList,
    isCloud: false,
    note: 'Saved locally. Will sync to Supabase once database table is set up.'
  };
}

/**
 * Update an existing review (either on Supabase or locally)
 * Strictly verifies ownership so only the author can edit their reflection.
 */
export async function updateCloudFeedback(vertical, reviewId, updatedFields, currentReviews = []) {
  if (!isMyReview(reviewId)) {
    console.warn('[Supabase Feedback] Unauthorized edit blocked for review ID:', reviewId);
    return {
      success: false,
      error: 'Unauthorized: You can only edit feedback you personally submitted.',
      updatedReviews: currentReviews
    };
  }

  const isCloudId = !String(reviewId).startsWith('usr_');

  if (isSupabaseConfigured && supabase && isCloudId) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .update({
          name: updatedFields.name?.trim(),
          location: updatedFields.location?.trim(),
          topic: updatedFields.topic,
          rating: Number(updatedFields.rating) || 5,
          review: updatedFields.review?.trim(),
          recommended: updatedFields.recommended ?? true,
          is_edited: true
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (!error && data) {
        const updatedNormalized = normalizeCloudReview(data);
        updatedNormalized.isUserSubmitted = true;

        const updatedList = currentReviews.map(r => r.id === reviewId ? updatedNormalized : r);
        safeSet(`${FEEDBACK_CACHE_PREFIX}${vertical}`, updatedList);
        return { success: true, updatedReviews: updatedList, isCloud: true };
      }
    } catch (err) {
      console.warn('[Supabase Feedback] Update exception:', err);
    }
  }

  // Local update fallback
  const updatedList = currentReviews.map(r => {
    if (r.id === reviewId) {
      return {
        ...r,
        ...updatedFields,
        date: 'Updated just now',
        isEdited: true
      };
    }
    return r;
  });

  safeSet(`${FEEDBACK_CACHE_PREFIX}${vertical}`, updatedList);
  safeSet(`feedback_${vertical}`, updatedList);

  return { success: true, updatedReviews: updatedList, isCloud: false };
}

/**
 * Delete a user's review (from Supabase if present, and from local cache)
 * Strictly verifies ownership so only the author can delete their feedback.
 */
export async function deleteCloudFeedback(vertical, reviewId, currentReviews = []) {
  if (!isMyReview(reviewId)) {
    console.warn('[Supabase Feedback] Unauthorized delete blocked for review ID:', reviewId);
    return {
      success: false,
      error: 'Unauthorized: You can only delete feedback that you personally submitted.',
      updatedReviews: currentReviews
    };
  }

  unrecordMyReviewId(reviewId);

  const isCloudId = !String(reviewId).startsWith('usr_');
  if (isSupabaseConfigured && supabase && isCloudId) {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.warn('[Supabase Feedback] Delete notice:', error.message);
      }
    } catch (err) {
      console.warn('[Supabase Feedback] Delete exception:', err);
    }
  }

  const updatedList = currentReviews.filter(r => r.id !== reviewId);
  safeSet(`${FEEDBACK_CACHE_PREFIX}${vertical}`, updatedList);
  safeSet(`feedback_${vertical}`, updatedList);

  return { success: true, updatedReviews: updatedList };
}

/**
 * Toggle like for a review.
 * Updates local like memory so user cannot spam, and pushes updated like count to Supabase.
 */
export async function toggleCloudFeedbackLike(vertical, reviewId, currentReviews = []) {
  const likesMap = getStoredLikesMap(vertical);
  const isCurrentlyLiked = Boolean(likesMap[reviewId]);
  const newLikedState = !isCurrentlyLiked;

  // New map for user's personal likes
  const updatedLikesMap = {
    ...likesMap,
    [reviewId]: newLikedState
  };
  setStoredLikesMap(vertical, updatedLikesMap);

  let targetReview = currentReviews.find(r => r.id === reviewId);
  const currentCount = Number(targetReview?.likes || 0);
  const newCount = newLikedState ? currentCount + 1 : Math.max(0, currentCount - 1);

  const updatedReviews = currentReviews.map(r => {
    if (r.id === reviewId) {
      return {
        ...r,
        likes: newCount
      };
    }
    return r;
  });

  safeSet(`${FEEDBACK_CACHE_PREFIX}${vertical}`, updatedReviews);
  safeSet(`feedback_${vertical}`, updatedReviews);

  // Sync to Supabase if it's a cloud review
  const isCloudId = !String(reviewId).startsWith('usr_');
  if (isSupabaseConfigured && supabase && isCloudId) {
    try {
      await supabase
        .from('feedback')
        .update({ likes: newCount })
        .eq('id', reviewId);
    } catch (err) {
      console.warn('[Supabase Feedback] Like sync exception:', err);
    }
  }

  return {
    updatedReviews,
    newLikesMap: updatedLikesMap,
    isLiked: newLikedState
  };
}

/**
 * Subscribe to real-time feedback updates across all users
 */
export function subscribeToFeedbackRealtime(vertical, onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    const channelName = `public:feedback:${vertical}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback',
          filter: `vertical=eq.${vertical}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            onUpdate({ type: 'INSERT', review: normalizeCloudReview(payload.new) });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            onUpdate({ type: 'UPDATE', review: normalizeCloudReview(payload.new) });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            onUpdate({ type: 'DELETE', id: String(payload.old.id) });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Supabase Feedback] Realtime subscription error:', err);
    return () => {};
  }
}

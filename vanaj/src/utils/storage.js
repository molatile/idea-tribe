/**
 * Vanaj Cultural Archive - Unified Local Storage Manager
 * Handles persistent storage for:
 * - Cultural Feedback & Ratings (Dance, Food, Marketplace, Tourism, Languages)
 * - Review Likes & Helpful counts
 * - Item-level favorites & likes (dances, dishes, handicrafts, tourism spots)
 * - Community Language Inscriptions
 * - Workshop Proposals
 */

const STORAGE_PREFIX = 'vanaj_';

// Check if localStorage is available
export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safe Get from LocalStorage
 */
export const safeGet = (key, fallback = null) => {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[Vanaj Storage] Error reading key "${key}":`, err);
    return fallback;
  }
};

/**
 * Safe Set to LocalStorage
 */
export const safeSet = (key, value) => {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    // Dispatch custom event for reactive in-app updates
    window.dispatchEvent(new CustomEvent('vanaj_storage_changed', {
      detail: { key, value }
    }));
    return true;
  } catch (err) {
    console.error(`[Vanaj Storage] Error writing key "${key}":`, err);
    return false;
  }
};

/**
 * Safe Remove from LocalStorage
 */
export const safeRemove = (key) => {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    window.dispatchEvent(new CustomEvent('vanaj_storage_changed', {
      detail: { key, value: null }
    }));
    return true;
  } catch (err) {
    console.error(`[Vanaj Storage] Error removing key "${key}":`, err);
    return false;
  }
};

/* ==========================================================================
   FEEDBACK & REVIEWS SYSTEM
   ========================================================================== */

export const getStoredReviews = (vertical, defaultReviews = []) => {
  const stored = safeGet(`feedback_${vertical}`);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  // If not in storage yet, persist default reviews
  if (defaultReviews && defaultReviews.length > 0) {
    safeSet(`feedback_${vertical}`, defaultReviews);
    return defaultReviews;
  }
  return [];
};

export const saveUserReview = (vertical, newReview, currentReviews = []) => {
  const updated = [newReview, ...currentReviews];
  safeSet(`feedback_${vertical}`, updated);
  return updated;
};

export const updateUserReview = (vertical, reviewId, updatedFields, currentReviews = []) => {
  const updated = currentReviews.map(rev => {
    if (rev.id === reviewId) {
      return {
        ...rev,
        ...updatedFields,
        date: 'Updated just now',
        isEdited: true
      };
    }
    return rev;
  });
  safeSet(`feedback_${vertical}`, updated);
  return updated;
};

export const deleteStoredReview = (vertical, reviewId, currentReviews = []) => {
  const updated = currentReviews.filter(r => r.id !== reviewId);
  safeSet(`feedback_${vertical}`, updated);
  return updated;
};

export const resetStoredReviews = (vertical, defaultReviews = []) => {
  safeSet(`feedback_${vertical}`, defaultReviews);
  return defaultReviews;
};

/* ==========================================================================
   FEEDBACK DRAFTS (PERSIST UNCOMMITTED INPUT)
   ========================================================================== */

export const getFeedbackDraft = (vertical) => {
  return safeGet(`feedback_draft_${vertical}`, null);
};

export const saveFeedbackDraft = (vertical, draft) => {
  if (!draft || (!draft.name && !draft.location && !draft.review)) {
    safeRemove(`feedback_draft_${vertical}`);
    return;
  }
  safeSet(`feedback_draft_${vertical}`, draft);
};

export const clearFeedbackDraft = (vertical) => {
  safeRemove(`feedback_draft_${vertical}`);
};

/* ==========================================================================
   REVIEW LIKES / HELPFUL VOTES
   ========================================================================== */

export const getStoredReviewLikes = (vertical) => {
  return safeGet(`likes_${vertical}`, {}) || {};
};

export const toggleStoredReviewLike = (vertical, reviewId, currentReviews = []) => {
  const likesMap = getStoredReviewLikes(vertical);
  const isCurrentlyLiked = !!likesMap[reviewId];
  const newLikesMap = {
    ...likesMap,
    [reviewId]: !isCurrentlyLiked
  };
  safeSet(`likes_${vertical}`, newLikesMap);

  // Update like count in reviews list
  const updatedReviews = currentReviews.map(rev => {
    if (rev.id === reviewId) {
      const currentCount = Number(rev.likes || 0);
      return {
        ...rev,
        likes: isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1
      };
    }
    return rev;
  });

  safeSet(`feedback_${vertical}`, updatedReviews);
  return { updatedReviews, newLikesMap, isLiked: !isCurrentlyLiked };
};

/* ==========================================================================
   ITEM-LEVEL FAVORITES / LIKES (Dances, Food, Crafts, Tourism)
   ========================================================================== */

export const getItemLikes = (category) => {
  return safeGet(`item_likes_${category}`, {}) || {};
};

export const toggleItemLike = (category, itemId, initialCount = 0) => {
  const allLikes = getItemLikes(category);
  const currentItem = allLikes[itemId] || { liked: false, count: initialCount };
  const newLikedState = !currentItem.liked;
  const newCount = newLikedState 
    ? (currentItem.count || initialCount) + 1 
    : Math.max(0, (currentItem.count || initialCount) - 1);

  const updatedLikes = {
    ...allLikes,
    [itemId]: {
      liked: newLikedState,
      count: newCount
    }
  };

  safeSet(`item_likes_${category}`, updatedLikes);
  return { liked: newLikedState, count: newCount };
};

/* ==========================================================================
   COMMUNITY LANGUAGE INSCRIPTIONS
   ========================================================================== */

const DEFAULT_INSCRIPTIONS = [
  {
    id: 'insc_seed_1',
    language: 'santali',
    word: 'Sarna Dhorom',
    translation: 'Sacred grove religion / animistic faith worshipping nature and Sal trees.',
    contributor: 'Somra Murmu',
    timestamp: 'Seed Archive',
    likes: 12
  },
  {
    id: 'insc_seed_2',
    language: 'mundari',
    word: 'Sasandiri',
    translation: 'Memorial stone slabs erected by ancestral families to honor departed elders.',
    contributor: 'Birsa Munda',
    timestamp: 'Seed Archive',
    likes: 8
  },
  {
    id: 'insc_seed_3',
    language: 'ho',
    word: 'Baa Porob',
    translation: 'Flower Festival celebrating the arrival of spring and sacred blossoms.',
    contributor: 'Gita Sinku',
    timestamp: 'Seed Archive',
    likes: 15
  }
];

export const getStoredLanguageInscriptions = () => {
  const stored = safeGet('language_inscriptions');
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  safeSet('language_inscriptions', DEFAULT_INSCRIPTIONS);
  return DEFAULT_INSCRIPTIONS;
};

export const saveLanguageInscription = (inscription) => {
  const current = getStoredLanguageInscriptions();
  const updated = [inscription, ...current];
  safeSet('language_inscriptions', updated);
  return updated;
};

export const deleteLanguageInscription = (id) => {
  const current = getStoredLanguageInscriptions();
  const updated = current.filter(item => item.id !== id);
  safeSet('language_inscriptions', updated);
  return updated;
};

export const toggleLanguageInscriptionLike = (id) => {
  const userLikes = safeGet('user_inscriptions_likes', {}) || {};
  const isLiked = !!userLikes[id];
  const newUserLikes = { ...userLikes, [id]: !isLiked };
  safeSet('user_inscriptions_likes', newUserLikes);

  const current = getStoredLanguageInscriptions();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        likes: isLiked ? Math.max(0, (item.likes || 0) - 1) : (item.likes || 0) + 1
      };
    }
    return item;
  });
  safeSet('language_inscriptions', updated);
  return { updated, isLiked: !isLiked };
};

export const getUserInscriptionLikes = () => {
  return safeGet('user_inscriptions_likes', {}) || {};
};

/* ==========================================================================
   WORKSHOP PROPOSALS (Tourism Host Workshop Form)
   ========================================================================== */

export const getStoredWorkshopProposals = () => {
  return safeGet('tourism_workshop_proposals', []) || [];
};

export const saveWorkshopProposal = (proposal) => {
  const current = getStoredWorkshopProposals();
  const newProposal = {
    id: `prop_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    ...proposal
  };
  const updated = [newProposal, ...current];
  safeSet('tourism_workshop_proposals', updated);
  return updated;
};

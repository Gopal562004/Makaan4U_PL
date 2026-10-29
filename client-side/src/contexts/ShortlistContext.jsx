import React, { createContext, useContext, useState, useEffect } from "react";

const ShortlistContext = createContext();

export const useShortlist = () => {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error("useShortlist must be used within a ShortlistProvider");
  }
  return context;
};

export const ShortlistProvider = ({ children }) => {
  // Saved / Shortlisted Properties
  const [savedProperties, setSavedProperties] = useState(() => {
    try {
      const saved = localStorage.getItem("makaan_saved_properties");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare List (max 4 properties)
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem("makaan_compare_list");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently Viewed Properties
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem("makaan_recently_viewed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Scheduled Site Visits
  const [siteVisits, setSiteVisits] = useState(() => {
    try {
      const saved = localStorage.getItem("makaan_site_visits");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Enquiries
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem("makaan_enquiries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved Searches / Alerts
  const [savedSearches, setSavedSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("makaan_saved_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("makaan_saved_properties", JSON.stringify(savedProperties));
  }, [savedProperties]);

  useEffect(() => {
    localStorage.setItem("makaan_compare_list", JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem("makaan_recently_viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem("makaan_site_visits", JSON.stringify(siteVisits));
  }, [siteVisits]);

  useEffect(() => {
    localStorage.setItem("makaan_enquiries", JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem("makaan_saved_searches", JSON.stringify(savedSearches));
  }, [savedSearches]);

  // Actions
  const isSaved = (propertyId) => {
    return savedProperties.some((p) => p.id === propertyId || p._id === propertyId);
  };

  const toggleSaveProperty = (property) => {
    setSavedProperties((prev) => {
      const exists = prev.some((p) => (p.id || p._id) === (property.id || property._id));
      if (exists) {
        return prev.filter((p) => (p.id || p._id) !== (property.id || property._id));
      }
      return [property, ...prev];
    });
  };

  const isInCompare = (propertyId) => {
    return compareList.some((p) => (p.id || p._id) === propertyId);
  };

  const toggleCompare = (property) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => (p.id || p._id) === (property.id || property._id));
      if (exists) {
        return prev.filter((p) => (p.id || p._id) !== (property.id || property._id));
      }
      if (prev.length >= 4) {
        // Replace oldest or cap at 4
        return [...prev.slice(1), property];
      }
      return [...prev, property];
    });
  };

  const removeFromCompare = (propertyId) => {
    setCompareList((prev) => prev.filter((p) => (p.id || p._id) !== propertyId));
  };

  const clearCompare = () => setCompareList([]);

  const addRecentlyViewed = (property) => {
    if (!property) return;
    setRecentlyViewed((prev) => {
      const id = property.id || property._id;
      const filtered = prev.filter((p) => (p.id || p._id) !== id);
      return [property, ...filtered].slice(0, 8);
    });
  };

  const scheduleVisit = (visitData) => {
    const visitId = visitData?.id || `sv-${Date.now()}`;
    const newVisit = {
      id: visitId,
      status: "Requested",
      createdAt: new Date().toISOString(),
      ...visitData
    };

    setSiteVisits((prev) => {
      const filtered = prev.filter(
        (v) =>
          v.id !== visitId &&
          !(
            v.buyerPhone === newVisit.buyerPhone &&
            v.date === newVisit.date &&
            v.propertyTitle === newVisit.propertyTitle
          )
      );
      return [newVisit, ...filtered];
    });

    return newVisit;
  };

  const addEnquiry = (enquiryData) => {
    const enqId = enquiryData?.id || `enq-${Date.now()}`;
    const newEnq = {
      id: enqId,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Assigned",
      ...enquiryData
    };

    setEnquiries((prev) => {
      const filtered = prev.filter(
        (e) =>
          e.id !== enqId &&
          !(
            e.buyerPhone === newEnq.buyerPhone &&
            e.propertyTitle === newEnq.propertyTitle
          )
      );
      return [newEnq, ...filtered];
    });

    return newEnq;
  };

  return (
    <ShortlistContext.Provider
      value={{
        savedProperties,
        isSaved,
        toggleSaveProperty,
        compareList,
        isInCompare,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        recentlyViewed,
        addRecentlyViewed,
        siteVisits,
        scheduleVisit,
        enquiries,
        addEnquiry,
        savedSearches,
        setSavedSearches
      }}
    >
      {children}
    </ShortlistContext.Provider>
  );
};

export default ShortlistContext;

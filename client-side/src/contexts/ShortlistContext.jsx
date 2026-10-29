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
    const newVisit = {
      id: `sv-${Date.now()}`,
      status: "Requested",
      createdAt: new Date().toISOString(),
      ...visitData
    };
    setSiteVisits((prev) => [newVisit, ...prev]);

    // Synchronize directly into Admin Inquiries store
    try {
      const rawAdmin = localStorage.getItem("makaan_admin_inquiries");
      const currentList = rawAdmin ? JSON.parse(rawAdmin) : [];
      const adminInquiry = {
        _id: newVisit.id,
        id: newVisit.id,
        type: "site-visit",
        name: newVisit.buyerName || newVisit.name || "Scheduled Buyer",
        fullName: newVisit.buyerName || newVisit.name || "Scheduled Buyer",
        buyerName: newVisit.buyerName || newVisit.name || "Scheduled Buyer",
        phone: newVisit.buyerPhone || newVisit.phone || "",
        buyerPhone: newVisit.buyerPhone || newVisit.phone || "",
        email: newVisit.buyerEmail || newVisit.email || "",
        propertyId: newVisit.propertyId || "",
        propertyTitle: newVisit.propertyTitle || "Private Property Tour",
        propertyLocation: newVisit.location || "Mumbai",
        date: newVisit.date || "",
        preferredDate: newVisit.date || "",
        timeSlot: newVisit.timeSlot || "11:00 AM - 12:30 PM",
        preferredTime: newVisit.timeSlot || "11:00 AM - 12:30 PM",
        visitType: newVisit.visitType || "In-Person Guided Tour",
        message: newVisit.notes || "",
        notes: newVisit.notes || "",
        status: newVisit.status || "Requested",
        priority: "High",
        createdAt: newVisit.createdAt,
      };
      const updated = [adminInquiry, ...currentList.filter((item) => (item.id || item._id) !== newVisit.id)];
      localStorage.setItem("makaan_admin_inquiries", JSON.stringify(updated));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("makaan:inquiry_added", { detail: adminInquiry }));
      }
    } catch (e) {
      console.warn("Could not sync visit to makaan_admin_inquiries:", e);
    }

    return newVisit;
  };

  const addEnquiry = (enquiryData) => {
    const newEnq = {
      id: `enq-${Date.now()}`,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Assigned",
      ...enquiryData
    };
    setEnquiries((prev) => [newEnq, ...prev]);

    // Synchronize directly into Admin Inquiries store
    try {
      const rawAdmin = localStorage.getItem("makaan_admin_inquiries");
      const currentList = rawAdmin ? JSON.parse(rawAdmin) : [];
      const adminInquiry = {
        _id: newEnq.id,
        id: newEnq.id,
        type: "callback",
        name: newEnq.buyerName || newEnq.name || "Priority Client",
        fullName: newEnq.buyerName || newEnq.name || "Priority Client",
        buyerName: newEnq.buyerName || newEnq.name || "Priority Client",
        phone: newEnq.buyerPhone || newEnq.phone || "",
        buyerPhone: newEnq.buyerPhone || newEnq.phone || "",
        email: newEnq.buyerEmail || newEnq.email || "",
        propertyId: newEnq.propertyId || "",
        propertyTitle: newEnq.propertyTitle || "Priority Callback",
        propertyLocation: newEnq.location || "Mumbai",
        message: newEnq.message || "",
        notes: newEnq.message || "",
        status: "New",
        priority: "High",
        createdAt: newEnq.submittedDate,
      };
      const updated = [adminInquiry, ...currentList.filter((item) => (item.id || item._id) !== newEnq.id)];
      localStorage.setItem("makaan_admin_inquiries", JSON.stringify(updated));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("makaan:inquiry_added", { detail: adminInquiry }));
      }
    } catch (e) {
      console.warn("Could not sync enquiry to makaan_admin_inquiries:", e);
    }

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

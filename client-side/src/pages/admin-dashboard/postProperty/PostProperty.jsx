import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { createProperty, getPropertyById, getRawPropertyById, updateProperty, getAvailableAgents } from "../../../lib/mongo/services/propertyService";
import { useParams, useNavigate } from "react-router-dom";

// Memoized input components
const InputField = React.memo(
  ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    icon,
    ...props
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center">
        {icon && (
          <Icon name={icon} size={16} className="mr-2 text-muted-foreground" />
        )}
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        {...props}
      />
    </div>
  )
);

const SelectField = React.memo(
  ({ label, options, value, onChange, required = false, icon, ...props }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center">
        {icon && (
          <Icon name={icon} size={16} className="mr-2 text-muted-foreground" />
        )}
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
);

const TextareaField = React.memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    rows = 4,
    ...props
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-vertical"
        {...props}
      />
    </div>
  )
);

const CheckboxField = React.memo(({ label, checked, onChange, ...props }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="rounded border-border text-primary focus:ring-primary"
      {...props}
    />
    <span className="text-sm text-foreground">{label}</span>
  </label>
));

const PostProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    description: "",
    price: "",
    type: "",
    category: "residential",

    // Location
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      locality: "",
      landmark: "",
      coordinates: { lat: "", lng: "" },
      googlePlaceId: "",
    },

    // Enhanced Specifications
    specifications: {
      bedrooms: "",
      bathrooms: "",
      balconies: "",
      area: "",
      areaUnit: "sqft",
      carpetArea: "",
      builtUpArea: "",
      superBuiltUpArea: "",
      builtYear: "",
      ageOfConstruction: "",
      constructionStatus: "ready-to-move",
      possessionDate: "",
      floor: "",
      totalFloors: "",
      facing: "north",
      furnishing: "unfurnished",
      parking: "none",
      parkingCount: "",
      lift: false,
      powerBackup: false,
      waterSupply: "corporation",
      overlooking: [],
      ownership: "freehold",
      approvedBy: [],
      occupancyCertificate: false,
    },

    // Financial Details
    priceNegotiable: false,
    maintenanceCharges: {
      amount: "",
      period: "monthly",
    },
    securityDeposit: "",
    bookingAmount: "",

    // Arrays
    amenities: [],
    features: [],
    nearbyPlaces: [],
    transportation: [],

    // Status & Features
    status: "available",
    featured: false,
    priority: "medium",

    // Contact Info
    contactInfo: {
      showPhone: true,
      showEmail: true,
      preferredContact: "all",
      viewingSchedule: "appointment-only",
      availableFrom: "",
      availableTill: "",
    },

    // Agent Assignment
    assignedAgent: "",
    manualAgentInfo: {
      name: "",
      email: "",
      phone: "",
      alternatePhone: "",
      designation: "Property Consultant",
      company: "",
      avatar: "",
      experience: "0+",
      languages: ["English", "Hindi"],
      rating: "",
      reviewCount: "",
      propertiesSold: "",
      responseTime: "",
      availability: "within-24h",
      verified: false,
    },

    images: [],
    existingImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [agentSelectionMethod, setAgentSelectionMethod] = useState("select");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Fetch user role and available agents
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch property for editing
  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await getPropertyById(id);
          const raw = res?.property || res?._raw || res;
          if (raw) {
            const rawType =
              raw.type ||
              raw.specifications?.type ||
              (raw.propertyType ? raw.propertyType.toLowerCase().replace(/\s+/g, "-") : "") ||
              "apartment";

            const rawCategory =
              raw.category ||
              raw.specifications?.category ||
              "residential";

            setFormData((prev) => ({
              ...prev,
              title: raw.title || "",
              description: raw.description || "",
              price: raw.price !== undefined && raw.price !== null ? String(raw.price) : "",
              type: rawType,
              category: rawCategory,
              status: raw.status || "available",
              featured: !!raw.featured,
              priority: raw.priority || "medium",
              location: {
                ...prev.location,
                ...(typeof raw.location === "object" ? raw.location : {}),
                address: raw.location?.address || raw.address || "",
                city: raw.location?.city || raw.city || "",
                state: raw.location?.state || raw.state || "",
                pincode: raw.location?.pincode || raw.pincode || "",
                locality: raw.location?.locality || raw.locality || "",
                landmark: raw.location?.landmark || raw.landmark || "",
                coordinates: {
                  lat: raw.location?.coordinates?.lat ?? raw.coordinates?.lat ?? "",
                  lng: raw.location?.coordinates?.lng ?? raw.coordinates?.lng ?? "",
                },
                googlePlaceId: raw.location?.googlePlaceId || "",
              },
              specifications: {
                ...prev.specifications,
                ...(typeof raw.specifications === "object" ? raw.specifications : {}),
                bedrooms: raw.specifications?.bedrooms !== undefined ? String(raw.specifications.bedrooms) : (raw.bedrooms !== undefined ? String(raw.bedrooms) : "1"),
                bathrooms: raw.specifications?.bathrooms !== undefined ? String(raw.specifications.bathrooms) : (raw.bathrooms !== undefined ? String(raw.bathrooms) : "1"),
                balconies: raw.specifications?.balconies !== undefined ? String(raw.specifications.balconies) : "0",
                area: raw.specifications?.area !== undefined ? String(raw.specifications.area) : (raw.area !== undefined ? String(raw.area) : ""),
                areaUnit: raw.specifications?.areaUnit || "sqft",
                carpetArea: raw.specifications?.carpetArea !== undefined ? String(raw.specifications.carpetArea) : "",
                builtUpArea: raw.specifications?.builtUpArea !== undefined ? String(raw.specifications.builtUpArea) : "",
                superBuiltUpArea: raw.specifications?.superBuiltUpArea !== undefined ? String(raw.specifications.superBuiltUpArea) : "",
                builtYear: raw.specifications?.builtYear || "",
                ageOfConstruction: raw.specifications?.ageOfConstruction || "",
                constructionStatus: (() => {
                  const cs = String(raw.specifications?.constructionStatus || "ready-to-move").toLowerCase();
                  if (cs.includes("under")) return "under-construction";
                  if (cs.includes("launch")) return "new-launch";
                  if (cs.includes("resale")) return "resale";
                  return "ready-to-move";
                })(),
                floor: raw.specifications?.floor !== undefined ? String(raw.specifications.floor) : "",
                totalFloors: raw.specifications?.totalFloors !== undefined ? String(raw.specifications.totalFloors) : "",
                facing: raw.specifications?.facing || "north",
                furnishing: (() => {
                  const f = String(raw.specifications?.furnishing || raw.furnishing || "unfurnished").toLowerCase();
                  if (f.includes("semi")) return "semi-furnished";
                  if (f.includes("fully") || f.includes("full")) return "fully-furnished";
                  return "unfurnished";
                })(),
                parking: (() => {
                  const p = String(raw.specifications?.parking || raw.parking || "none").toLowerCase();
                  if (p.includes("covered")) return "covered";
                  if (p.includes("open")) return "open";
                  if (p.includes("basement")) return "basement";
                  if (p.includes("multiple")) return "multiple";
                  if (["none", "open", "covered", "basement", "multiple"].includes(p)) return p;
                  return "none";
                })(),
                parkingCount: raw.specifications?.parkingCount !== undefined ? String(raw.specifications.parkingCount) : "",
                lift: !!raw.specifications?.lift,
                powerBackup: !!raw.specifications?.powerBackup,
                waterSupply: raw.specifications?.waterSupply || "corporation",
                ownership: raw.specifications?.ownership || "freehold",
                occupancyCertificate: !!raw.specifications?.occupancyCertificate,
              },
              amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
              features: Array.isArray(raw.features) ? raw.features : [],
              nearbyPlaces: Array.isArray(raw.nearbyPlaces) ? raw.nearbyPlaces : [],
              transportation: Array.isArray(raw.transportation) ? raw.transportation : [],
              priceNegotiable: !!raw.priceNegotiable,
              maintenanceCharges: {
                amount: raw.maintenanceCharges?.amount !== undefined ? String(raw.maintenanceCharges.amount) : "",
                period: raw.maintenanceCharges?.period || "monthly",
              },
              securityDeposit: raw.securityDeposit !== undefined ? String(raw.securityDeposit) : "",
              bookingAmount: raw.bookingAmount !== undefined ? String(raw.bookingAmount) : "",
              assignedAgent: raw.assignedAgent?._id || raw.assignedAgent || raw.postedBy?._id || raw.postedBy || "",
              images: [],
              existingImages: Array.isArray(raw.images) ? raw.images : (raw.image ? [raw.image] : []),
            }));
          }
        } catch (error) {
          console.error("Failed to load property for editing:", error);
          toast.error("Failed to load property for editing: " + (error.message || ""));
          navigate("/admin/properties");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode, navigate]);

  const fetchUserData = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserRole = userData.role || "customer";
      setUserRole(currentUserRole);

      if (currentUserRole === "employee" || currentUserRole === "admin") {
        setFormData((prev) => ({
          ...prev,
          assignedAgent: userData.id,
        }));
      }

      if (currentUserRole === "admin" || currentUserRole === "customer") {
        setLoadingAgents(true);
        const agentsResponse = await getAvailableAgents();
        setAvailableAgents(agentsResponse.agents || []);
        setLoadingAgents(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error loading agent data");
    }
  }, []);

  // Handler functions
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleNestedChange = useCallback((parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  }, []);

  const handleDeepNestedChange = useCallback((parent, child, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: {
          ...prev[parent][child],
          [field]: value,
        },
      },
    }));
  }, []);

  const handleManualAgentChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      manualAgentInfo: {
        ...prev.manualAgentInfo,
        [field]: value,
      },
    }));
  }, []);

  const handleArrayToggle = useCallback((arrayName, value) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(value)
        ? prev[arrayName].filter((item) => item !== value)
        : [...prev[arrayName], value],
    }));
  }, []);

  const handleSpecificationToggle = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: prev.specifications[field].includes(value)
          ? prev.specifications[field].filter((item) => item !== value)
          : [...prev.specifications[field], value],
      },
    }));
  }, []);

  const handleAgentSelectionChange = useCallback((method) => {
    setAgentSelectionMethod(method);
    setFormData((prev) => ({
      ...prev,
      assignedAgent: "",
      manualAgentInfo: {
        name: "",
        email: "",
        phone: "",
        alternatePhone: "",
        designation: "Property Consultant",
        company: "",
        avatar: "",
        experience: "0+",
        languages: ["English", "Hindi"],
        rating: "",
        reviewCount: "",
        propertiesSold: "",
        responseTime: "",
        availability: "within-24h",
        verified: false,
      },
    }));
  }, []);

  const handleAgentSelect = useCallback((agentId) => {
    setFormData((prev) => ({
      ...prev,
      assignedAgent: agentId,
    }));
  }, []);

  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (files.length + formData.images.length > 10) {
        toast.warning("Maximum 10 images allowed");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
      toast.success(`${files.length} image(s) added`);
    },
    [formData.images.length]
  );

  const removeImage = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.info("Image removed");
  }, []);

  // Options for dropdowns
  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "independent-house", label: "Independent House" },
    { value: "villa", label: "Villa" },
    { value: "studio-apartment", label: "Studio Apartment" },
    { value: "penthouse", label: "Penthouse" },
    { value: "duplex", label: "Duplex" },
    { value: "farm-house", label: "Farm House" },
    { value: "plot", label: "Plot" },
    { value: "commercial-office", label: "Commercial Office" },
    { value: "commercial-shop", label: "Commercial Shop" },
    { value: "commercial-warehouse", label: "Commercial Warehouse" },
    { value: "industrial", label: "Industrial" },
    { value: "agricultural-land", label: "Agricultural Land" },
    { value: "hotel-resort", label: "Hotel/Resort" },
  ];

  const categories = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "agricultural", label: "Agricultural" },
  ];

  const areaUnits = [
    { value: "sqft", label: "Square Feet" },
    { value: "sqm", label: "Square Meters" },
    { value: "sqyd", label: "Square Yards" },
    { value: "acre", label: "Acre" },
    { value: "hectare", label: "Hectare" },
  ];

  const constructionStatuses = [
    { value: "ready-to-move", label: "Ready to Move" },
    { value: "under-construction", label: "Under Construction" },
    { value: "new-launch", label: "New Launch" },
    { value: "resale", label: "Resale" },
  ];

  const facingOptions = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
    { value: "north-east", label: "North East" },
    { value: "north-west", label: "North West" },
    { value: "south-east", label: "South East" },
    { value: "south-west", label: "South West" },
  ];

  const furnishingOptions = [
    { value: "unfurnished", label: "Unfurnished" },
    { value: "semi-furnished", label: "Semi Furnished" },
    { value: "fully-furnished", label: "Fully Furnished" },
  ];

  const parkingOptions = [
    { value: "none", label: "None" },
    { value: "open", label: "Open" },
    { value: "covered", label: "Covered" },
    { value: "basement", label: "Basement" },
    { value: "multiple", label: "Multiple" },
  ];

  const waterSupplyOptions = [
    { value: "corporation", label: "Corporation" },
    { value: "borewell", label: "Borewell" },
    { value: "both", label: "Both" },
    { value: "other", label: "Other" },
  ];

  const ownershipOptions = [
    { value: "freehold", label: "Freehold" },
    { value: "leasehold", label: "Leasehold" },
    { value: "co-operative", label: "Co-operative" },
    { value: "power-of-attorney", label: "Power of Attorney" },
  ];

  const maintenancePeriods = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  const contactOptions = [
    { value: "all", label: "All Methods" },
    { value: "phone", label: "Phone Only" },
    { value: "email", label: "Email Only" },
    { value: "whatsapp", label: "WhatsApp Only" },
  ];

  const viewingOptions = [
    { value: "flexible", label: "Flexible" },
    { value: "appointment-only", label: "Appointment Only" },
    { value: "weekdays", label: "Weekdays Only" },
    { value: "weekends", label: "Weekends Only" },
    { value: "specific-times", label: "Specific Times" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "premium", label: "Premium" },
  ];

  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "sold", label: "Sold" },
    { value: "rented", label: "Rented" },
    { value: "under-maintenance", label: "Under Maintenance" },
    { value: "under-construction", label: "Under Construction" },
    { value: "resale", label: "Resale" },
  ];

  // Enhanced amenities and features based on your schema
  const commonAmenities = [
    // Security
    "24x7-security",
    "cctv",
    "security-guards",
    "intercom",
    "fire-safety",
    // Outdoor
    "swimming-pool",
    "garden",
    "park",
    "children-play-area",
    "club-house",
    "jogging-track",
    "tennis-court",
    "basketball-court",
    "squash-court",
    "badminton-court",
    "gym",
    "yoga-area",
    // Indoor
    "community-hall",
    "party-area",
    "barbecue-area",
    "indoor-games",
    "library",
    "business-center",
    // Health & Wellness
    "spa",
    "sauna",
    "steam-room",
    "jacuzzi",
    // Services
    "concierge",
    "valet-parking",
    "car-wash",
    "house-keeping",
    "maintenance-staff",
    "power-backup",
    // Accessibility
    "pet-friendly",
    "senior-living",
    "wheelchair-accessible",
    "high-speed-internet",
    "smart-home",
    // Utilities
    "central-ac",
    "central-heating",
    "fireplace",
    "walk-in-closet",
    "hardwood-floors",
  ];

  const commonFeatures = [
    "corner-property",
    "main-road-facing",
    "green-view",
    "lake-view",
    "sea-view",
    "mountain-view",
    "corner-apartment",
    "premium-location",
    "corner-plot",
    "gated-community",
    "water-harvesting",
    "solar-panels",
    "vaastu-compliant",
    "energy-efficient",
    "sound-proof",
    "panic-room",
    "home-theater",
    "wine-cellar",
    "private-pool",
    "private-garden",
    "private-terrace",
  ];

  const overlookingOptions = [
    "garden",
    "park",
    "road",
    "pool",
    "sea",
    "mountain",
    "other",
  ];

  const approvalOptions = [
    "rera",
    "municipal",
    "development-authority",
    "other",
  ];

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !formData.title ||
      !formData.price ||
      !formData.type ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (
      formData.images.length === 0 &&
      (!formData.existingImages || formData.existingImages.length === 0)
    ) {
      toast.warning("Please add at least one property image");
      setLoading(false);
      return;
    }

    // Agent assignment validation
    if (
      userRole === "customer" &&
      !formData.assignedAgent &&
      !formData.manualAgentInfo.name
    ) {
      toast.error("Please assign an agent for the property");
      setLoading(false);
      return;
    }

    const toastId = toast.loading(isEditMode ? "Updating property..." : "Posting your property...");

    try {
      // Prepare data according to backend schema - using JSON.stringify for complex objects
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        category: formData.category,
        location: JSON.stringify(formData.location),
        specifications: JSON.stringify(formData.specifications),
        amenities: JSON.stringify(formData.amenities),
        features: JSON.stringify(formData.features),
        nearbyPlaces: JSON.stringify(formData.nearbyPlaces),
        transportation: JSON.stringify(formData.transportation),
        priceNegotiable: formData.priceNegotiable,
        maintenanceCharges: JSON.stringify(formData.maintenanceCharges),
        securityDeposit: Number(formData.securityDeposit) || 0,
        bookingAmount: Number(formData.bookingAmount) || 0,
        status: formData.status,
        featured: formData.featured,
        priority: formData.priority,
        contactInfo: JSON.stringify(formData.contactInfo),
        images: formData.images,
      };

      // Add agent assignment
      if (agentSelectionMethod === "select" && formData.assignedAgent) {
        propertyData.assignedAgent = formData.assignedAgent;
      } else if (
        agentSelectionMethod === "manual" &&
        formData.manualAgentInfo.name
      ) {
        propertyData.manualAgent = formData.manualAgentInfo;
      }

      let result;
      if (isEditMode) {
        result = await updateProperty(id, propertyData);
      } else {
        result = await createProperty(propertyData);
      }

      toast.update(toastId, {
        render:
          result.agentType === "manual"
            ? `Property ${isEditMode ? 'updated' : 'posted'} successfully with manual agent information! 🎉`
            : `Property ${isEditMode ? 'updated' : 'posted'} successfully! 🎉`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (isEditMode) {
        setTimeout(() => navigate("/admin/properties"), 1500);
        return;
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        type: "",
        category: "residential",
        location: {
          address: "",
          city: "",
          state: "",
          pincode: "",
          locality: "",
          landmark: "",
          coordinates: { lat: "", lng: "" },
          googlePlaceId: "",
        },
        specifications: {
          bedrooms: "",
          bathrooms: "",
          balconies: "",
          area: "",
          areaUnit: "sqft",
          carpetArea: "",
          builtUpArea: "",
          superBuiltUpArea: "",
          builtYear: "",
          ageOfConstruction: "",
          constructionStatus: "ready-to-move",
          possessionDate: "",
          floor: "",
          totalFloors: "",
          facing: "north",
          furnishing: "unfurnished",
          parking: "none",
          parkingCount: "",
          lift: false,
          powerBackup: false,
          waterSupply: "corporation",
          overlooking: [],
          ownership: "freehold",
          approvedBy: [],
          occupancyCertificate: false,
        },
        priceNegotiable: false,
        maintenanceCharges: { amount: "", period: "monthly" },
        securityDeposit: "",
        bookingAmount: "",
        amenities: [],
        features: [],
        nearbyPlaces: [],
        transportation: [],
        status: "available",
        featured: false,
        priority: "medium",
        contactInfo: {
          showPhone: true,
          showEmail: true,
          preferredContact: "all",
          viewingSchedule: "appointment-only",
          availableFrom: "",
          availableTill: "",
        },
        assignedAgent: "",
        manualAgentInfo: {
          name: "",
          email: "",
          phone: "",
          alternatePhone: "",
          designation: "Property Consultant",
          company: "",
          avatar: "",
          experience: "0+",
          languages: ["English", "Hindi"],
          rating: "",
          reviewCount: "",
          propertiesSold: "",
          responseTime: "",
          availability: "within-24h",
          verified: false,
        },
        images: [],
      });
      setCurrentStep(1);
    } catch (error) {
      console.error(isEditMode ? "Error updating property:" : "Error creating property:", error);
      toast.update(toastId, {
        render: error.message || `Error ${isEditMode ? 'updating' : 'posting'} property. Please try again.`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Progress Steps Component
  const ProgressSteps = () => (
    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <React.Fragment key={step}>
          <button
            type="button"
            onClick={() => setCurrentStep(step)}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-transform group-hover:scale-105 ${
                step === currentStep
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : step < currentStep
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            <span
              className={`text-xs mt-2 whitespace-nowrap transition-colors ${
                step === currentStep
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {step === 1 && "Basic Info"}
              {step === 2 && "Location"}
              {step === 3 && "Specifications"}
              {step === 4 && "Features"}
              {step === 5 && "Financial"}
              {step === 6 && "Agent & Images"}
            </span>
          </button>
          {step < totalSteps && (
            <div
              className={`flex-1 h-0.5 mx-3 min-w-[20px] ${
                step < currentStep ? "bg-success" : "bg-muted"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Agent Selection Component
  const AgentSelectionField = React.memo(() => {
    if (userRole === "employee") {
      return (
        <div className="bg-success/10 border border-success/20 rounded p-4">
          <div className="flex items-center space-x-2">
            <Icon name="UserCheck" size={20} className="text-success" />
            <span className="text-success font-medium">
              You are assigned as the agent for this property
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Assign Agent
            {userRole === "customer" && (
              <span className="text-error ml-1">*</span>
            )}
          </label>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleAgentSelectionChange("select")}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                agentSelectionMethod === "select"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              Select from List
            </button>
            <button
              type="button"
              onClick={() => handleAgentSelectionChange("manual")}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                agentSelectionMethod === "manual"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              Manual Agent Info
            </button>
          </div>
        </div>

        {agentSelectionMethod === "select" ? (
          <div className="space-y-3">
            {loadingAgents ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Loader" size={16} className="animate-spin" />
                <span>Loading available agents...</span>
              </div>
            ) : availableAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {availableAgents.map((agent) => (
                  <div
                    key={agent._id}
                    onClick={() => handleAgentSelect(agent._id)}
                    className={`p-3 border rounded cursor-pointer transition-all ${
                      formData.assignedAgent === agent._id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {agent.avatar ? (
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon
                            name="User"
                            size={16}
                            className="text-primary"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {agent.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {agent.designation} • {agent.experience || "0"}+ years
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Icon
                              name="Star"
                              size={12}
                              className="text-warning"
                            />
                            <span className="text-xs">
                              {agent.rating?.average || 0}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({agent.rating?.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                      {formData.assignedAgent === agent._id && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Icon name="Users" size={24} className="mx-auto mb-2" />
                <p>No agents available</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-info/10 border border-info/20 rounded p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} className="text-info" />
                <span className="text-sm text-info">
                  Enter agent details. This information will be stored directly
                  with the property.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Agent Name"
                placeholder="Enter agent full name"
                value={formData.manualAgentInfo.name}
                onChange={(e) =>
                  handleManualAgentChange("name", e.target.value)
                }
                required={userRole === "customer"}
                icon="UserPlus"
              />
              <InputField
                label="Designation"
                placeholder="e.g., Senior Property Consultant"
                value={formData.manualAgentInfo.designation}
                onChange={(e) =>
                  handleManualAgentChange("designation", e.target.value)
                }
                icon="Briefcase"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Agent Email"
                type="email"
                placeholder="agent@example.com"
                value={formData.manualAgentInfo.email}
                onChange={(e) =>
                  handleManualAgentChange("email", e.target.value)
                }
                icon="Mail"
              />
              <InputField
                label="Agent Phone"
                placeholder="+91 00000 00000"
                value={formData.manualAgentInfo.phone}
                onChange={(e) =>
                  handleManualAgentChange("phone", e.target.value)
                }
                icon="Phone"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Experience"
                placeholder="e.g., 5+ years"
                value={formData.manualAgentInfo.experience}
                onChange={(e) =>
                  handleManualAgentChange("experience", e.target.value)
                }
                icon="Award"
              />
              <InputField
                label="Company"
                placeholder="Company name"
                value={formData.manualAgentInfo.company}
                onChange={(e) =>
                  handleManualAgentChange("company", e.target.value)
                }
                icon="Building"
              />
            </div>
          </div>
        )}

        {(formData.assignedAgent || formData.manualAgentInfo.name) && (
          <div className="bg-primary/5 border border-primary/20 rounded p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="UserCheck" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Assigned Agent:
                </span>
                <span className="text-sm text-muted-foreground">
                  {formData.assignedAgent
                    ? availableAgents.find(
                        (a) => a._id === formData.assignedAgent
                      )?.name
                    : formData.manualAgentInfo.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    assignedAgent: "",
                    manualAgentInfo: {
                      name: "",
                      email: "",
                      phone: "",
                      alternatePhone: "",
                      designation: "Property Consultant",
                      company: "",
                      avatar: "",
                      experience: "0+",
                      languages: ["English", "Hindi"],
                      rating: "",
                      reviewCount: "",
                      propertiesSold: "",
                      responseTime: "",
                      availability: "within-24h",
                      verified: false,
                    },
                  }));
                }}
                className="text-error hover:text-error/80 transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  });

  // Step 1: Basic Information
  const Step1 = () => (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Info" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Basic Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Property Title"
          placeholder="e.g., Luxury 3BHK Apartment with Sea View"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
          icon="Tag"
        />

        <InputField
          label="Price"
          type="number"
          placeholder="Enter price"
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          required
          icon="DollarSign"
        />

        <SelectField
          label="Property Type"
          options={propertyTypes}
          value={formData.type}
          onChange={(e) => handleInputChange("type", e.target.value)}
          required
          icon="Building"
        />

        <SelectField
          label="Category"
          options={categories}
          value={formData.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          required
          icon="Briefcase"
        />
      </div>

      <div className="mt-6">
        <TextareaField
          label="Description"
          placeholder="Describe your property in detail..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <SelectField
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          icon="Flag"
        />

        <SelectField
          label="Priority"
          options={priorityOptions}
          value={formData.priority}
          onChange={(e) => handleInputChange("priority", e.target.value)}
          icon="Star"
        />

        <div className="flex items-center space-x-4 pt-6">
          <CheckboxField
            label="Featured Property"
            checked={formData.featured}
            onChange={(e) => handleInputChange("featured", e.target.checked)}
          />
          <CheckboxField
            label="Price Negotiable"
            checked={formData.priceNegotiable}
            onChange={(e) =>
              handleInputChange("priceNegotiable", e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Location Details
  const Step2 = () => (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="MapPin" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Location Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Address"
          placeholder="Street address"
          value={formData.location.address}
          onChange={(e) =>
            handleNestedChange("location", "address", e.target.value)
          }
          required
          icon="Navigation"
        />

        <InputField
          label="Locality"
          placeholder="Locality/Area"
          value={formData.location.locality}
          onChange={(e) =>
            handleNestedChange("location", "locality", e.target.value)
          }
          icon="MapPin"
        />

        <InputField
          label="City"
          placeholder="City"
          value={formData.location.city}
          onChange={(e) =>
            handleNestedChange("location", "city", e.target.value)
          }
          required
          icon="Map"
        />

        <InputField
          label="State"
          placeholder="State"
          value={formData.location.state}
          onChange={(e) =>
            handleNestedChange("location", "state", e.target.value)
          }
          required
        />

        <InputField
          label="Pincode"
          placeholder="Pincode"
          value={formData.location.pincode}
          onChange={(e) =>
            handleNestedChange("location", "pincode", e.target.value)
          }
          required
        />

        <InputField
          label="Landmark"
          placeholder="Nearby landmark"
          value={formData.location.landmark}
          onChange={(e) =>
            handleNestedChange("location", "landmark", e.target.value)
          }
        />

        <InputField
          label="Latitude"
          type="number"
          placeholder="Latitude"
          value={formData.location.coordinates.lat}
          onChange={(e) =>
            handleDeepNestedChange(
              "location",
              "coordinates",
              "lat",
              e.target.value
            )
          }
          step="any"
        />

        <InputField
          label="Longitude"
          type="number"
          placeholder="Longitude"
          value={formData.location.coordinates.lng}
          onChange={(e) =>
            handleDeepNestedChange(
              "location",
              "coordinates",
              "lng",
              e.target.value
            )
          }
          step="any"
        />
      </div>
    </div>
  );

  // Step 3: Specifications
  const Step3 = () => (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Ruler" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Specifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InputField
          label="Bedrooms"
          type="number"
          placeholder="0"
          value={formData.specifications.bedrooms}
          onChange={(e) =>
            handleNestedChange("specifications", "bedrooms", e.target.value)
          }
          icon="Bed"
        />

        <InputField
          label="Bathrooms"
          type="number"
          placeholder="0"
          value={formData.specifications.bathrooms}
          onChange={(e) =>
            handleNestedChange("specifications", "bathrooms", e.target.value)
          }
          icon="Bath"
        />

        <InputField
          label="Balconies"
          type="number"
          placeholder="0"
          value={formData.specifications.balconies}
          onChange={(e) =>
            handleNestedChange("specifications", "balconies", e.target.value)
          }
          icon="Square"
        />

        <InputField
          label="Area"
          type="number"
          placeholder="Area size"
          value={formData.specifications.area}
          onChange={(e) =>
            handleNestedChange("specifications", "area", e.target.value)
          }
          required
          icon="Square"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <SelectField
          label="Area Unit"
          options={areaUnits}
          value={formData.specifications.areaUnit}
          onChange={(e) =>
            handleNestedChange("specifications", "areaUnit", e.target.value)
          }
          required
        />

        <InputField
          label="Carpet Area"
          type="number"
          placeholder="Carpet area"
          value={formData.specifications.carpetArea}
          onChange={(e) =>
            handleNestedChange("specifications", "carpetArea", e.target.value)
          }
        />

        <InputField
          label="Built-up Area"
          type="number"
          placeholder="Built-up area"
          value={formData.specifications.builtUpArea}
          onChange={(e) =>
            handleNestedChange("specifications", "builtUpArea", e.target.value)
          }
        />

        <InputField
          label="Super Built-up Area"
          type="number"
          placeholder="Super built-up area"
          value={formData.specifications.superBuiltUpArea}
          onChange={(e) =>
            handleNestedChange(
              "specifications",
              "superBuiltUpArea",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <InputField
          label="Floor"
          type="number"
          placeholder="Floor number"
          value={formData.specifications.floor}
          onChange={(e) =>
            handleNestedChange("specifications", "floor", e.target.value)
          }
        />

        <InputField
          label="Total Floors"
          type="number"
          placeholder="Total floors"
          value={formData.specifications.totalFloors}
          onChange={(e) =>
            handleNestedChange("specifications", "totalFloors", e.target.value)
          }
        />

        <SelectField
          label="Facing"
          options={facingOptions}
          value={formData.specifications.facing}
          onChange={(e) =>
            handleNestedChange("specifications", "facing", e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <SelectField
          label="Furnishing"
          options={furnishingOptions}
          value={formData.specifications.furnishing}
          onChange={(e) =>
            handleNestedChange("specifications", "furnishing", e.target.value)
          }
        />

        <SelectField
          label="Parking"
          options={parkingOptions}
          value={formData.specifications.parking}
          onChange={(e) =>
            handleNestedChange("specifications", "parking", e.target.value)
          }
        />

        <InputField
          label="Parking Count"
          type="number"
          placeholder="Number of parking"
          value={formData.specifications.parkingCount}
          onChange={(e) =>
            handleNestedChange("specifications", "parkingCount", e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <InputField
          label="Built Year"
          type="number"
          placeholder="e.g., 2020"
          value={formData.specifications.builtYear}
          onChange={(e) =>
            handleNestedChange("specifications", "builtYear", e.target.value)
          }
        />

        <InputField
          label="Age of Construction"
          placeholder="e.g., 2 years"
          value={formData.specifications.ageOfConstruction}
          onChange={(e) =>
            handleNestedChange(
              "specifications",
              "ageOfConstruction",
              e.target.value
            )
          }
        />

        <SelectField
          label="Construction Status"
          options={constructionStatuses}
          value={formData.specifications.constructionStatus}
          onChange={(e) =>
            handleNestedChange(
              "specifications",
              "constructionStatus",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          label="Possession Date"
          type="date"
          value={formData.specifications.possessionDate}
          onChange={(e) =>
            handleNestedChange(
              "specifications",
              "possessionDate",
              e.target.value
            )
          }
        />

        <SelectField
          label="Water Supply"
          options={waterSupplyOptions}
          value={formData.specifications.waterSupply}
          onChange={(e) =>
            handleNestedChange("specifications", "waterSupply", e.target.value)
          }
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium text-foreground mb-3 block">
          Overlooking
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {overlookingOptions.map((option) => (
            <CheckboxField
              key={option}
              label={option}
              checked={formData.specifications.overlooking.includes(option)}
              onChange={() => handleSpecificationToggle("overlooking", option)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SelectField
          label="Ownership"
          options={ownershipOptions}
          value={formData.specifications.ownership}
          onChange={(e) =>
            handleNestedChange("specifications", "ownership", e.target.value)
          }
        />

        <div className="flex items-center space-x-4 pt-6">
          <CheckboxField
            label="Lift Available"
            checked={formData.specifications.lift}
            onChange={(e) =>
              handleNestedChange("specifications", "lift", e.target.checked)
            }
          />
          <CheckboxField
            label="Power Backup"
            checked={formData.specifications.powerBackup}
            onChange={(e) =>
              handleNestedChange(
                "specifications",
                "powerBackup",
                e.target.checked
              )
            }
          />
          <CheckboxField
            label="Occupancy Certificate"
            checked={formData.specifications.occupancyCertificate}
            onChange={(e) =>
              handleNestedChange(
                "specifications",
                "occupancyCertificate",
                e.target.checked
              )
            }
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium text-foreground mb-3 block">
          Approved By
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {approvalOptions.map((option) => (
            <CheckboxField
              key={option}
              label={option}
              checked={formData.specifications.approvedBy.includes(option)}
              onChange={() => handleSpecificationToggle("approvedBy", option)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Step 4: Features & Amenities
  const Step4 = () => (
    <div className="space-y-6">
      {/* Amenities */}
      <div className="bg-card border border-border rounded p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Wifi" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {commonAmenities.map((amenity) => (
            <CheckboxField
              key={amenity}
              label={amenity
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              checked={formData.amenities.includes(amenity)}
              onChange={() => handleArrayToggle("amenities", amenity)}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-card border border-border rounded p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Star" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Features</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {commonFeatures.map((feature) => (
            <CheckboxField
              key={feature}
              label={feature
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              checked={formData.features.includes(feature)}
              onChange={() => handleArrayToggle("features", feature)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Step 5: Financial Details
  const Step5 = () => (
    <div className="bg-card border border-border rounded p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="DollarSign" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Financial Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Security Deposit"
          type="number"
          placeholder="Security deposit amount"
          value={formData.securityDeposit}
          onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
          icon="Shield"
        />

        <InputField
          label="Booking Amount"
          type="number"
          placeholder="Booking amount"
          value={formData.bookingAmount}
          onChange={(e) => handleInputChange("bookingAmount", e.target.value)}
          icon="CreditCard"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          label="Maintenance Charges"
          type="number"
          placeholder="Maintenance amount"
          value={formData.maintenanceCharges.amount}
          onChange={(e) =>
            handleNestedChange("maintenanceCharges", "amount", e.target.value)
          }
          icon="Settings"
        />

        <SelectField
          label="Maintenance Period"
          options={maintenancePeriods}
          value={formData.maintenanceCharges.period}
          onChange={(e) =>
            handleNestedChange("maintenanceCharges", "period", e.target.value)
          }
        />
      </div>

      {/* Contact Information */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Phone" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Preferred Contact"
            options={contactOptions}
            value={formData.contactInfo.preferredContact}
            onChange={(e) =>
              handleNestedChange(
                "contactInfo",
                "preferredContact",
                e.target.value
              )
            }
          />

          <SelectField
            label="Viewing Schedule"
            options={viewingOptions}
            value={formData.contactInfo.viewingSchedule}
            onChange={(e) =>
              handleNestedChange(
                "contactInfo",
                "viewingSchedule",
                e.target.value
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <InputField
            label="Available From"
            type="date"
            value={formData.contactInfo.availableFrom}
            onChange={(e) =>
              handleNestedChange("contactInfo", "availableFrom", e.target.value)
            }
          />

          <InputField
            label="Available Till"
            type="date"
            value={formData.contactInfo.availableTill}
            onChange={(e) =>
              handleNestedChange("contactInfo", "availableTill", e.target.value)
            }
          />
        </div>

        <div className="flex items-center space-x-6 mt-6">
          <CheckboxField
            label="Show Phone Number"
            checked={formData.contactInfo.showPhone}
            onChange={(e) =>
              handleNestedChange("contactInfo", "showPhone", e.target.checked)
            }
          />
          <CheckboxField
            label="Show Email Address"
            checked={formData.contactInfo.showEmail}
            onChange={(e) =>
              handleNestedChange("contactInfo", "showEmail", e.target.checked)
            }
          />
        </div>
      </div>
    </div>
  );

  // Step 6: Agent & Images
  const Step6 = () => (
    <>
      {/* Agent Assignment */}
      {(userRole === "admin" || userRole === "customer") && (
        <div className="bg-card border border-border rounded p-6 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <Icon name="User" size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Agent Assignment
            </h2>
          </div>
          <AgentSelectionField />
        </div>
      )}

      {/* Images Upload */}
      <div className="bg-card border border-border rounded p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Image" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Property Images
          </h2>
        </div>

        <div className="border-2 border-dashed border-border rounded p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-3"
          >
            <Icon name="Upload" size={32} className="text-muted-foreground" />
            <div>
              <p className="text-foreground font-medium">
                Click to upload images
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, WEBP up to 10MB (Max 10 images)
              </p>
            </div>
            <Button type="button" variant="outline">
              Choose Files
            </Button>
          </label>
        </div>

        {/* Existing Images from Database */}
        {formData.existingImages?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
              <span>Current Property Photos ({formData.existingImages.length})</span>
              <span className="text-xs text-muted-foreground font-normal">Active on live database</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.existingImages.map((image, index) => {
                const imgUrl = typeof image === "string" ? image : image?.url;
                if (!imgUrl) return null;
                return (
                  <div key={index} className="relative group border border-border rounded overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Current Property ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-0.5 text-[10px] text-white truncate">
                      {index === 0 ? "Primary Cover" : `Photo ${index + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {formData.images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              New Images to Add ({formData.images.length}/10)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-error text-error-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return Step1();
      case 2:
        return Step2();
      case 3:
        return Step3();
      case 4:
        return Step4();
      case 5:
        return Step5();
      case 6:
        return Step6();
      default:
        return Step1();
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Icon name="Home" size={24} className="text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {isEditMode ? "Edit Property Record" : "Post New Property"}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {isEditMode
                ? "Update real-time pricing, specifications, and details stored in MongoDB"
                : "List your property and reach verified buyers or tenants"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/properties")}
            iconName="ArrowLeft"
            iconPosition="left"
            className="self-start sm:self-auto"
          >
            Back to Properties
          </Button>
        </div>

        {/* Progress Steps */}
        <ProgressSteps />

        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 mt-8 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                iconName="ArrowRight"
                iconPosition="right"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                iconName="Upload"
                iconPosition="left"
              >
                {loading ? (isEditMode ? "Updating Property..." : "Posting Property...") : (isEditMode ? "Update Property" : "Post Property")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProperty;
import { create } from "zustand";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.echosync.ai";

const useReviewStore = create((set, get) => ({
  reviews: [],
  reviewMetrics: {
    averageRating: 0,
    totalReviews: 0,
    responseRate: 0,
  },
  selectedPlatform: "All",
  viewMode: "list",
  responseFilter: "all",
  ratingFilter: "all",
  searchTerm: "",
  isLoading: false,
  error: null,
  locations: [],
  selectedLocationId: null,

  setReviews: (reviews) => set({ reviews }),
  setReviewMetrics: (metrics) => set({ reviewMetrics: metrics }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setResponseFilter: (filter) => set({ responseFilter: filter }),
  setRatingFilter: (filter) => set({ ratingFilter: filter }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setLocations: (locations) => set({ locations }),
  setSelectedLocationId: (locationId) =>
    set({ selectedLocationId: locationId }),

  fetchLocations: async (session) => {
    const { setIsLoading, setError, setLocations } = get();
    if (session?.user?.googleBusinessProfileConnected) {
      try {
        setIsLoading(true);
        const connectedPlatform = session.user.googleBusinessProfileConnected;
        const res = await fetch(
          `${apiUrl}/locations?accessToken=${connectedPlatform.accessToken}&email=${session.user.email}`,
          {
            headers: {
              Authorization: `Bearer ${connectedPlatform.accessToken}`,
            },
          },
        );
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();
        setLocations(data.locations);
        if (data.locations.length > 0) {
          get().setSelectedLocationId(data.locations[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  },

  fetchReviews: async (session) => {
    const {
      setIsLoading,
      setError,
      setReviews,
      setReviewMetrics,
      selectedLocationId,
    } = get();
    if (session?.user?.googleBusinessProfileConnected && selectedLocationId) {
      try {
        setIsLoading(true);
        const connectedPlatform = session.user.googleBusinessProfileConnected;
        const res = await fetch(
          `${apiUrl}/reviews/reviews?accessToken=${connectedPlatform.accessToken}&email=${session.user.email}&locationId=${selectedLocationId}`,
          {
            headers: {
              Authorization: `Bearer ${connectedPlatform.accessToken}`,
            },
          },
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        const locationData = data.locations.find(
          (location) => location.id === selectedLocationId,
        );
        if (locationData) {
          setReviewMetrics({
            averageRating: locationData.reviews.averageRating,
            totalReviews: locationData.reviews.totalReviewCount,
            responseRate: locationData?.responseRate,
          });
          setReviews(locationData.reviews.reviews);
        } else {
          throw new Error("Selected location data not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  },

  respondToReview: async (session, reviewId, response) => {
    const { setIsLoading, setError, setReviews, selectedLocationId } = get();
    if (session?.user?.googleBusinessProfileConnected && selectedLocationId) {
      try {
        setIsLoading(true);
        const connectedPlatform = session.user.googleBusinessProfileConnected;
        const res = await fetch(`${apiUrl}/reviews/reply-to-review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${connectedPlatform.accessToken}`,
          },
          body: JSON.stringify({
            accessToken: connectedPlatform.accessToken,
            email: session.user.email,
            locationId: selectedLocationId,
            reviewName: reviewId,
            replyText: response,
          }),
        });
        if (!res.ok) throw new Error("Failed to respond to review");
        const data = await res.json();
        if (data.success) {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.reviewId === reviewId
                ? { ...review, reviewReply: { comment: response } }
                : review,
            ),
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  },

  bulkRespond: async (session, responses) => {
    const { setIsLoading, setError, setReviews, selectedLocationId } = get();
    if (session?.user?.googleBusinessProfileConnected && selectedLocationId) {
      try {
        setIsLoading(true);
        const connectedPlatform = session.user.googleBusinessProfileConnected;
        const res = await fetch(`${apiUrl}/reviews/bulk-reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${connectedPlatform.accessToken}`,
          },
          body: JSON.stringify({
            accessToken: connectedPlatform.accessToken,
            email: session.user.email,
            locationId: selectedLocationId,
            responses: responses,
          }),
        });
        if (!res.ok) throw new Error("Failed to send bulk responses");
        const data = await res.json();
        if (data.success) {
          setReviews((prevReviews) =>
            prevReviews.map((review) => ({
              ...review,
              reviewReply: responses[review.reviewId]
                ? { comment: responses[review.reviewId] }
                : review.reviewReply,
            })),
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  },

  generateInsights: async (session, review) => {
    const { setIsLoading, setError } = get();
    if (session?.user?.googleBusinessProfileConnected) {
      try {
        setIsLoading(true);
        const connectedPlatform = session.user.googleBusinessProfileConnected;
        const res = await fetch(`${apiUrl}/reviews/generate-insights`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${connectedPlatform.accessToken}`,
          },
          body: JSON.stringify({
            accessToken: connectedPlatform.accessToken,
            email: session.user.email,
            business_name: "Echosync",
            business_context:
              "Echosync is an AI-powered review management platform that helps businesses efficiently manage and respond to customer feedback, enhance their online reputation, and gain actionable insights from reviews.",
            user_review: review.comment,
            reviewer_name: review.reviewer.displayName,
          }),
        });
        if (!res.ok) throw new Error("Failed to generate insights");
        const data = await res.json();
        return data.insights;
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    return [];
  },

  generateAIResponse: async (session, review, insights) => {
    const { setIsLoading, setError } = get();
    if (session?.user?.googleBusinessProfileConnected) {
      try {
        setIsLoading(true);
        const connectedPlatform = session.user.googleBusinessProfileConnected;
        const res = await fetch(`${apiUrl}/reviews/generate-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${connectedPlatform.accessToken}`,
          },
          body: JSON.stringify({
            accessToken: connectedPlatform.accessToken,
            email: session.user.email,
            business_name: "Echosync",
            business_context:
              "Echosync is an AI-powered review management platform that helps businesses efficiently manage and respond to customer feedback, enhance their online reputation, and gain actionable insights from reviews.",
            user_review: review.comment,
            reviewer_name: review.reviewer.displayName,
            insights: insights,
          }),
        });
        if (!res.ok) throw new Error("Failed to generate AI response");
        const data = await res.json();
        return data.response;
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    return "";
  },

  getFilteredReviews: () => {
    const {
      reviews,
      selectedPlatform,
      responseFilter,
      ratingFilter,
      searchTerm,
    } = get();
    return reviews.filter((review) => {
      const platformMatch =
        selectedPlatform === "All" || review.platform === selectedPlatform;
      const responseMatch =
        responseFilter === "all" ||
        (responseFilter === "responded" && review.reviewReply?.comment) ||
        (responseFilter === "notResponded" && !review.reviewReply?.comment);
      const ratingMatch =
        ratingFilter === "all" || review.starRating === ratingFilter;
      const searchMatch =
        review?.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewer.displayName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return platformMatch && responseMatch && ratingMatch && searchMatch;
    });
  },
}));

export default useReviewStore;

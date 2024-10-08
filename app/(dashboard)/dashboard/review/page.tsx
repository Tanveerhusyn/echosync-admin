"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTypeWriter from "@/hooks/useTypeWriter";
import Link from "next/link";
import action from "../../../actions";
import BulkResponseModal from "@/components/custom/BulkResponseModal";
import {
  Filter,
  ChevronDown,
  ChevronRight,
  Home,
  TrendingUp,
  CheckCircle,
  RefreshCw,
  ChevronUp,
  ThumbsUp,
} from "lucide-react";
import { Star, X, MessageCircle, Sparkles, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useReviewStore from "@/hooks/useReviewStore";

const Modal = ({ isOpen, onClose, review }) => {
  const [response, setResponse] = useState("");
  const [editableResponse, setEditableResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [insights, setInsights] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [triggerTypewriter, setTriggerTypewriter] = useState(0);

  const displayedResponse = useTypeWriter(aiResponse, 10, triggerTypewriter);

  const { data: session } = useSession();
  const { generateInsights, generateAIResponse, respondToReview } =
    useReviewStore((state) => ({
      generateInsights: state.generateInsights,
      generateAIResponse: state.generateAIResponse,
      respondToReview: state.respondToReview,
    }));

  const starRatingMap = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };

  const numericRating = starRatingMap[review.starRating] || 0;

  useEffect(() => {
    if (isOpen) {
      generateInsights(session, review).then((insights) =>
        setInsights(insights),
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (displayedResponse) {
      setEditableResponse(displayedResponse);
    }
  }, [displayedResponse]);

  const handleGenerateAIResponse = async () => {
    setIsGenerating(true);
    setEditableResponse(""); // Clear existing text
    setAiResponse(""); // Clear existing AI response
    const newAiResponse = await generateAIResponse(session, review, insights);
    setAiResponse(newAiResponse);
    setTriggerTypewriter((prev) => prev + 1); // Increment to trigger typewriter effect
    setIsGenerating(false);
  };

  const handleResponseChange = (e) => {
    setEditableResponse(e.target.value);
  };

  const handleSendResponse = async () => {
    if (!session?.user) {
      console.error("No user session found");
      return;
    }

    setIsSending(true);
    try {
      await respondToReview(session, review.name, editableResponse);
      toast.success("Response sent successfully");
      // await action("refreshReviews");
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setIsSending(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 bg-[#181c31] text-white">
              <h2 className="text-2xl font-bold">Review Insights</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-start mb-6">
                <img
                  src={
                    review.reviewer.profilePhotoUrl ||
                    `https://ui-avatars.com/api/?name=${review.reviewer.displayName}&background=random`
                  }
                  alt={review.reviewer.displayName}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-xl">
                    {review.reviewer.displayName}
                  </h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < numericRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        fill={i < numericRating ? "currentColor" : "none"}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(review.createTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-100 p-4 rounded-lg mb-6"
              >
                <p className="text-gray-800 text-lg italic">{review.comment}</p>
              </motion.div>

              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2 flex items-center">
                  <Sparkles className="mr-2 text-yellow-500" />
                  AI-Powered Insights
                </h4>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      <p className={`flex-1 text-start`}>{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Your Response</h4>
                <div className="relative mb-2">
                  <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Type your response here or use AI to generate one..."
                    value={editableResponse || displayedResponse}
                    onChange={handleResponseChange}
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-[#181c31] text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  onClick={handleGenerateAIResponse}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="animate-spin mr-2" size={20} />
                  ) : (
                    <Sparkles className="mr-2" size={20} />
                  )}
                  {isGenerating
                    ? "Generating AI Response..."
                    : "Generate AI Response"}
                </motion.button>
              </div>
            </div>

            <div className="flex justify-between items-center p-6 bg-gray-50 border-t">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-2 bg-[#181c31] text-white rounded-full hover:bg-blue-600 transition-colors"
                onClick={handleSendResponse}
                disabled={isSending}
              >
                {isSending ? (
                  <RefreshCw className="animate-spin mr-2" size={18} />
                ) : (
                  <Send size={18} className="mr-2" />
                )}
                {isSending ? "Sending..." : "Send Response"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState(review?.reviewReply?.comment || "");

  const starRatingMap = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };

  const numericRating = starRatingMap[review.starRating] || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <img
              src={review.reviewer.profilePhotoUrl}
              alt={review.reviewer.displayName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <h3 className="font-bold text-lg">{review.reviewer.displayName}</h3>
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < numericRating ? "text-yellow-400" : "text-gray-300"
                }
                fill={i < numericRating ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {new Date(review.createTime).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <p className={`text-gray-700 ${isExpanded ? "" : "line-clamp-2"}`}>
        {review.comment}
      </p>
      {!isExpanded && (
        <button
          className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
          onClick={() => setIsExpanded(true)}
        >
          Read more
        </button>
      )}

      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-600 mb-2">
            Your Response:
          </h4>
          <p className={`text-gray-700 ${isExpanded ? "" : "line-clamp-2"}`}>
            {response}
          </p>
          {!isExpanded && response.length > 100 && (
            <button
              className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
              onClick={() => setIsExpanded(true)}
            >
              Show full response
            </button>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${
              response ? "bg-green-500" : "bg-green-500"
            } text-white px-4 py-2 rounded-full font-medium flex items-center`}
            onClick={() => setIsModalOpen(true)}
          >
            <MessageCircle size={18} className="mr-2" />
            {response ? "Edit Response" : "Respond"}
          </motion.button>
        </div>
      </div>
      {isExpanded && (
        <button
          className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
          onClick={() => setIsExpanded(false)}
        >
          <ChevronUp size={16} className="mr-1" />
          Show less
        </button>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={review}
      />
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtext, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${color}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{subtext}</p>
      </div>
      <div
        className={`p-3 rounded-full ${color
          .replace("border-", "bg-")
          .replace("500", "100")}`}
      >
        <Icon size={24} className={color.replace("border-", "text-")} />
      </div>
    </div>
  </motion.div>
);

const Breadcrumbs = () => (
  <nav className="text-sm mb-4">
    <ol className="list-none p-0 inline-flex">
      <li className="flex items-center">
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          <Home size={16} />
        </Link>
        <ChevronRight size={16} className="mx-2" />
      </li>
      <li className="flex items-center">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-600">
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
      </li>
      <li className="text-gray-700">Reviews</li>
    </ol>
  </nav>
);

const CreativeLoader = () => {
  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="flex space-x-4 mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={iconVariants}>
          <Star size={32} className="text-yellow-500" />
        </motion.div>
        <motion.div variants={iconVariants}>
          <MessageCircle size={32} className="text-blue-500" />
        </motion.div>
        <motion.div variants={iconVariants}>
          <ThumbsUp size={32} className="text-green-500" />
        </motion.div>
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw size={48} className="text-purple-500" />
      </motion.div>
      <motion.p
        className="mt-4 text-lg font-semibold text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading Reviews...
      </motion.p>
    </div>
  );
};

const ReviewsPage = () => {
  const { data: session } = useSession();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const {
    reviews,
    reviewMetrics,
    selectedPlatform,
    viewMode,
    responseFilter,
    ratingFilter,
    searchTerm,
    isLoading,
    error,
    selectedLocationId,
    setSelectedPlatform,
    setViewMode,
    setResponseFilter,
    setRatingFilter,
    setSearchTerm,
    fetchReviewsAndLocations,
    fetchReviewsForLocation,
    getFilteredReviews,
    respondToReview,
  } = useReviewStore();

  const fetchInitialData = useCallback(async () => {
    if (session && !selectedLocationId) {
      await fetchReviewsAndLocations(session);
    }
  }, [session, selectedLocationId, fetchReviewsAndLocations]);

  const fetchLocationReviews = useCallback(async () => {
    if (session && selectedLocationId) {
      await fetchReviewsForLocation(session, selectedLocationId);
    }
  }, [session, selectedLocationId, fetchReviewsForLocation]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchLocationReviews();
  }, [fetchLocationReviews, reviews]);

  const filteredReviews = getFilteredReviews();

  if (isLoading && reviews.length === 0) return <CreativeLoader />;
  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Reviews Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Star}
          title="Average Rating"
          value={reviewMetrics.averageRating?.toFixed(1) || "N/A"}
          subtext={`Based on ${reviewMetrics.totalReviews || 0} reviews`}
          color="border-yellow-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Reviews"
          value={reviewMetrics.totalReviews || 0}
          subtext="Overall"
          color="border-green-500"
        />
        <StatCard
          icon={CheckCircle}
          title="Response Rate"
          value={`${reviewMetrics.responseRate || 0}%`}
          subtext="of reviews responded"
          color="border-blue-500"
        />
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-2 md:mb-0">Recent Reviews</h2>
        <div className="flex flex-wrap items-center space-x-4">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <button
              className={`px-3 py-1 rounded-full ${
                viewMode === "list"
                  ? "bg-[#181c31] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
            <button
              className={`px-3 py-1 rounded-full ${
                viewMode === "grid"
                  ? "bg-[#181c31] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
          </div>
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Filter size={18} className="text-gray-500" />
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="All">All Platforms</option>
              <option value="GOOGLE">Google</option>
              {/* Add other platforms as needed */}
            </select>
          </div>
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={`${responseFilter}_${ratingFilter}`}
              onChange={(e) => {
                const [newResponseFilter, newRatingFilter] =
                  e.target.value.split("_");
                setResponseFilter(newResponseFilter);
                setRatingFilter(newRatingFilter);
              }}
            >
              <option value="all_all">All Reviews</option>
              <option value="responded_all">Responded</option>
              <option value="notResponded_all">Not Responded</option>
              <option value="all_5">5 Star</option>
              <option value="all_4">4 Star</option>
              <option value="all_3">3 Star</option>
              <option value="all_2">2 Star</option>
              <option value="all_1">1 Star</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search reviews..."
              className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""
          }
        >
          {filteredReviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      </AnimatePresence>

      {filteredReviews.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No reviews match your current filters.
        </div>
      )}

      {filteredReviews.length > 0 &&
        filteredReviews.length < reviews.length && (
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-[#181c31] text-white px-6 py-3 rounded-full font-medium"
            >
              Load More <ChevronDown size={18} className="ml-2" />
            </motion.button>
          </div>
        )}
      {/* <BulkResponseModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        reviews={reviews}
        onSendResponses={handleBulkRespond}
      /> */}
    </div>
  );
};

export default ReviewsPage;

"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Star,
  MessageCircle,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import useReviewStore from "@/hooks/useReviewStore";

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
const ReviewDashboard = () => {
  const { data: session } = useSession();
  const {
    reviews,
    reviewMetrics,
    selectedLocationId,
    locations,
    isLoading,
    error,
    fetchReviewsAndLocations,
    setSearchTerm,
    setRatingFilter,
    getFilteredReviews,
  } = useReviewStore((state) => ({
    reviews: state.reviews,
    reviewMetrics: state.reviewMetrics,
    selectedLocationId: state.selectedLocationId,
    locations: state.locations,
    isLoading: state.isLoading,
    error: state.error,
    fetchReviewsAndLocations: state.fetchReviewsAndLocations,
    setSearchTerm: state.setSearchTerm,
    setRatingFilter: state.setRatingFilter,
    getFilteredReviews: state.getFilteredReviews,
  }));

  useEffect(() => {
    if (session?.user) {
      fetchReviewsAndLocations(session);
    }
  }, [session, fetchReviewsAndLocations]);

  const filteredReviews = getFilteredReviews();

  const chartData = [
    {
      name: "1 Star",
      value: reviews?.filter((r) => r.starRating === "ONE").length,
    },
    {
      name: "2 Stars",
      value: reviews?.filter((r) => r.starRating === "TWO").length,
    },
    {
      name: "3 Stars",
      value: reviews?.filter((r) => r.starRating === "THREE").length,
    },
    {
      name: "4 Stars",
      value: reviews?.filter((r) => r.starRating === "FOUR").length,
    },
    {
      name: "5 Stars",
      value: reviews?.filter((r) => r.starRating === "FIVE").length,
    },
  ];

  if (reviews.length === 0 && isLoading) {
    return <CreativeLoader />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getCurrentLocationName = () => {
    const currentLocation = locations.find(
      (loc) => loc.name === selectedLocationId,
    );
    return currentLocation ? currentLocation.title : "All Locations";
  };
  return (
    <div className="bg-white text-gray-800 min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-left text-gray-800">
        Review Dashboard - {getCurrentLocationName()}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-400 transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Average Rating
          </h2>
          <div className="flex items-center">
            <Star className="text-yellow-400 mr-2" size={32} />
            <span className="text-4xl font-bold text-gray-800">
              {reviewMetrics.averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Based on {reviewMetrics.totalReviews} reviews
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Total Reviews
          </h2>
          <div className="flex items-center">
            <MessageCircle className="text-blue-500 mr-2" size={32} />
            <span className="text-4xl font-bold text-gray-800">
              {reviewMetrics.totalReviews}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Overall feedback received
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Positive Reviews
          </h2>
          <div className="flex items-center">
            <ThumbsUp className="text-green-500 mr-2" size={32} />
            <span className="text-4xl font-bold text-gray-800">
              {
                reviews?.filter((r) => ["FOUR", "FIVE"].includes(r.starRating))
                  .length
              }
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">4 and 5 star ratings</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500 transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Negative Reviews
          </h2>
          <div className="flex items-center">
            <ThumbsDown className="text-red-500 mr-2" size={32} />
            <span className="text-4xl font-bold text-gray-800">
              {
                reviews.filter((r) => ["ONE", "TWO"].includes(r.starRating))
                  .length
              }
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">1 and 2 star ratings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Rating Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recent Activity
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {reviews.slice(0, 5).map((review, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-50 p-3 rounded-lg"
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    ["FOUR", "FIVE"].includes(review.starRating)
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {review.reviewer.displayName}
                  </span>{" "}
                  left a {review.starRating.toLowerCase()}-star review
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;

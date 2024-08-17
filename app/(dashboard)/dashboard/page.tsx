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
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.echosync.ai";

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
  const [reviewMetrics, setReviewMetrics] = useState({
    averageRating: 0,
    totalReviews: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    responseRate: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      if (session?.user) {
        try {
          setIsLoading(true);
          console.log("Fetching reviews...", session.user);
          const connectedPlatform = session.user.googleBusinessProfileConnected;
          const res = await fetch(
            `${apiUrl}/reviews/reviews?accessToken=${connectedPlatform.accessToken}&email=${session.user.email}`,
            {
              headers: {
                Authorization: `Bearer ${connectedPlatform.accessToken}`,
              },
            },
          );
          if (!res.ok) throw new Error("Failed to fetch reviews");
          const data = await res.json();
          const reviewsData = data.locations[1].reviews.reviews;

          // Helper function to convert string rating to number
          const getRatingNumber = (rating) => {
            const ratingMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
            return ratingMap[rating] || 0;
          };

          setReviewMetrics({
            averageRating: data.locations[1].reviews.averageRating,
            totalReviews: data.locations[1].reviews.totalReviewCount,
            positiveReviews: reviewsData.filter(
              (r) => getRatingNumber(r.starRating) >= 4,
            ).length,
            negativeReviews: reviewsData.filter(
              (r) => getRatingNumber(r.starRating) <= 2,
            ).length,
            responseRate: data?.responseRate,
          });
          setReviews(reviewsData);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchReviews();
    console.log("Session inside dashboard", session);
  }, []);

  const filteredReviews = reviews.filter(
    (review) =>
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRating === "all" ||
        parseInt(review.starRating.slice(-1)) === parseInt(filterRating)),
  );

  const chartData = [
    {
      name: "1 Star",
      value: reviews.filter((r) => r.starRating === "ONE").length,
    },
    {
      name: "2 Stars",
      value: reviews.filter((r) => r.starRating === "TWO").length,
    },
    {
      name: "3 Stars",
      value: reviews.filter((r) => r.starRating === "THREE").length,
    },
    {
      name: "4 Stars",
      value: reviews.filter((r) => r.starRating === "FOUR").length,
    },
    {
      name: "5 Stars",
      value: reviews.filter((r) => r.starRating === "FIVE").length,
    },
  ];

  if (isLoading) {
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

  return (
    <div className="bg-white text-gray-800 min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-left text-gray-800">
        Review Dashboard
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
              {reviewMetrics.positiveReviews}
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
              {reviewMetrics.negativeReviews}
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
                    parseInt(review.starRating.slice(-1)) >= 4
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {review.reviewer.displayName}
                  </span>{" "}
                  left a {review.starRating.slice(-1)}-star review
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">All Reviews</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
        <div className="space-y-6 max-h-[500px] overflow-y-auto">
          {filteredReviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-2">
                <img
                  src={review.reviewer.profilePhotoUrl}
                  alt={review.reviewer.displayName}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-blue-500"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {review.reviewer.displayName}
                  </h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < parseInt(review.starRating.slice(-1))
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        fill={
                          i < parseInt(review.starRating.slice(-1))
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(review.createTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              {review.reviewReply && (
                <div className="bg-blue-50 p-3 rounded-lg mt-2 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-sm text-blue-800 mb-1">
                    Your Response:
                  </h4>
                  <p className="text-gray-700">{review.reviewReply.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;

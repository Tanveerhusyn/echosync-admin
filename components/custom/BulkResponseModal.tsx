import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RefreshCw, CheckSquare } from "lucide-react";

const BulkResponseModal = ({ isOpen, onClose, reviews, onSendResponses }) => {
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [generatedResponses, setGeneratedResponses] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedReviews(reviews.filter((review) => !review.reviewReply));
    }
  }, [isOpen, reviews]);

  const handleSelectReview = (reviewId) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId],
    );
  };

  const generateResponses = async () => {
    setIsGenerating(true);
    // Simulating API call for bulk response generation
    const responses = {};
    for (let reviewId of selectedReviews) {
      responses[reviewId] = `Thank you for your feedback! We appreciate your ${
        Math.random() > 0.5 ? "positive" : "honest"
      } review.`;
    }
    setGeneratedResponses(responses);
    setIsGenerating(false);
  };

  const handleSendResponses = () => {
    onSendResponses(generatedResponses);
    onClose();
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
            className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 bg-[#181c31] text-white">
              <h2 className="text-2xl font-bold">Bulk Response Generation</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  Select Reviews to Respond
                </h3>
                {reviews.map((review) => (
                  <div key={review.reviewId} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={review.reviewId}
                      checked={selectedReviews.includes(review.reviewId)}
                      onChange={() => handleSelectReview(review.reviewId)}
                      className="mr-2"
                    />
                    <label htmlFor={review.reviewId} className="flex-1">
                      {review.comment.substring(0, 100)}...
                    </label>
                  </div>
                ))}
              </div>

              {Object.keys(generatedResponses).length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Generated Responses
                  </h3>
                  {Object.entries(generatedResponses).map(
                    ([reviewId, response]) => (
                      <div key={reviewId} className="mb-2">
                        <p className="font-medium">Review ID: {reviewId}</p>
                        <p className="ml-4">{response}</p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end items-center p-6 bg-gray-50 border-t">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-2 bg-[#181c31] text-white rounded-full hover:bg-blue-600 transition-colors mr-4"
                onClick={generateResponses}
                disabled={isGenerating || selectedReviews.length === 0}
              >
                {isGenerating ? (
                  <RefreshCw className="animate-spin mr-2" size={18} />
                ) : (
                  <CheckSquare size={18} className="mr-2" />
                )}
                {isGenerating ? "Generating..." : "Generate Responses"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                onClick={handleSendResponses}
                disabled={Object.keys(generatedResponses).length === 0}
              >
                <Send size={18} className="mr-2" />
                Send Responses
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkResponseModal;

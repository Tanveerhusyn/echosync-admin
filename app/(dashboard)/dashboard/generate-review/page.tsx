"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
function ReviewGenerator() {
  const [reviewText, setReviewText] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simulate sending review to backend for AI generation (replace with actual API call)
    const response = await simulateGenerateResponse(reviewText);
    setGeneratedResponse(response);
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl bg-white mt-20 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Generate Review Response</h1>
      <p className="text-gray-600 mb-8">
        Let our AI assistant help you craft professional and courteous replies
        to customer reviews.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          id="review-input"
          rows="8"
          placeholder="Paste the customer review here..."
          className="p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-500"
          value={reviewText}
          onChange={handleReviewChange}
        />
        <Button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={!reviewText.trim()}
        >
          Generate Response
        </Button>
      </form>
      {generatedResponse && (
        <div className="mt-8 p-4 border border-gray-300 rounded-md bg-gray-100">
          <p className="font-medium">Generated Response:</p>
          <p>{generatedResponse}</p>
        </div>
      )}
    </div>
  );
}

// Simulate sending review to backend (replace with actual API call)
const simulateGenerateResponse = async (reviewText) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        "Thank you for your feedback! We appreciate you taking the time to share your experience. We're sorry to hear that you encountered [issue from review]. We're always working to improve our [product/service], and your feedback is valuable to us. We've taken note of your concerns and will be sure to address them in the future.",
      );
    }, 1000); // Simulate processing time
  });
};

export default ReviewGenerator;

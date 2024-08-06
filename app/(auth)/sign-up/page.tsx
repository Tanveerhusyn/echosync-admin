import React from "react";
import CustomSignUp from "../../../components/forms/custom-signup";
import { Star, TrendingUp, MessageCircle, Award } from "lucide-react";

const ReviewBubble = ({ color, children }) => (
  <div
    className={`${color} rounded-full p-4 shadow-lg flex items-center space-x-2 animate-float`}
  >
    {children}
  </div>
);

const Page = () => {
  return (
    <div className="bg-gradient-to-br from-[#00072D] via-[#0A2472] to-blue-900 w-full h-full min-h-screen grid grid-cols-2 items-center">
      <div className="h-full flex flex-col justify-center items-center text-white p-8 relative overflow-hidden">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <img
                src="/main.svg"
                className="w-48 rounded-full"
                alt="Review Management System"
              />
            </div>
          </div>

          <ReviewBubble color="bg-yellow-400 text-yellow-900 absolute top-0 left-1/4">
            <Star className="w-6 h-6" />
            <span>4.9</span>
          </ReviewBubble>

          <ReviewBubble color="bg-green-400 text-green-900 absolute bottom-1/4 right-0">
            <TrendingUp className="w-6 h-6" />
            <span>+23%</span>
          </ReviewBubble>

          <ReviewBubble color="bg-blue-400 text-blue-900 absolute bottom-0 left-1/4">
            <MessageCircle className="w-6 h-6" />
            <span>2.5k</span>
          </ReviewBubble>

          <ReviewBubble color="bg-purple-400 text-purple-900 absolute top-1/4 left-0">
            <Award className="w-6 h-6" />
            <span>#1</span>
          </ReviewBubble>
        </div>

        <p className="text-xl mt-8 text-center max-w-md">
          Harness the power of customer voices. Our AI-driven platform
          transforms feedback into actionable insights, boosting your reputation
          and revenue.
        </p>
      </div>
      <div className="h-full">
        <CustomSignUp />
      </div>
    </div>
  );
};

export default Page;

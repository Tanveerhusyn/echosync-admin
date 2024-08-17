"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Check, X, Loader, Star } from "lucide-react";
import Head from "next/head";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export const PricingTier = ({
  title,
  price,
  features,
  recommended,
  priceId,
  onSubscribe,
}) => (
  <div
    className={`bg-gray-800 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${
      recommended ? "border-4 border-yellow-400" : ""
    }`}
  >
    {recommended && (
      <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg font-semibold">
        Recommended
      </div>
    )}
    <div className="p-8">
      <h3 className="text-3xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-5xl font-bold mb-6 text-white">
        ${price}
        <span className="text-xl font-normal text-gray-400">/mo</span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3 text-white">
            {feature.included ? (
              <Check className="w-6 h-6 text-green-400" />
            ) : (
              <X className="w-6 h-6 text-red-400" />
            )}
            <span className="text-lg">{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
    <button
      onClick={() => onSubscribe(priceId)}
      className={`w-full py-4 text-xl font-semibold text-gray-900 transition duration-300 ${
        recommended
          ? "bg-yellow-400 hover:bg-yellow-500"
          : "bg-blue-400 hover:bg-blue-500"
      }`}
    >
      Choose {title}
    </button>
  </div>
);

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);

  const tiers = [
    {
      title: "Essential",
      price: 49,
      priceId: "price_1PkPevChwewYxXGK7n8FMom4",
      features: [
        { text: "1000 Responses/month", included: true },
        { text: "1 Location", included: true },
        { text: "Generate manual reviews", included: true },
        { text: "AI Insights", included: false },
        { text: "Priority Support", included: false },
      ],
      recommended: true,
    },
    {
      title: "Pro",
      price: 99,
      priceId: "price_1PkPfGChwewYxXGKxcZyUGjB",
      features: [
        { text: "5000 Responses/month", included: true },
        { text: "5 Locations", included: true },
        { text: "Generate manual reviews", included: true },
        { text: "AI Insights", included: true },
        { text: "Priority Support", included: true },
      ],
    },
  ];

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const response = await fetch(
        "https://api.echosync.ai/payment/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        },
      );
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to initiate subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Choose Your Subscription Plan - Echosync</title>
        <meta
          name="description"
          content="Select the perfect subscription plan for your review management needs with Echosync."
        />
      </Head>

      <div className="bg-[#181c31] min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <h1 className="text-6xl font-bold text-center text-white mb-6">
            Choose Your Plan
          </h1>
          <p className="text-2xl text-center text-gray-300 mb-16 max-w-2xl mx-auto">
            Unlock the full potential of your customer reviews and supercharge
            your business growth
          </p>

          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Loader className="w-16 h-16 text-white animate-spin" />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <PricingTier
                key={index}
                {...tier}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;

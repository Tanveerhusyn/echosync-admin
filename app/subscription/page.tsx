"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Check, X, Loader } from "lucide-react";
import Head from "next/head";
import { toast } from "react-hot-toast";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

// PricingTier component
const PricingTier = ({
  title,
  price,
  features,
  recommended,
  priceId,
  onSubscribe,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-xl p-6 ${
      recommended
        ? "ring-2 ring-blue-500 transform scale-105"
        : "hover:shadow-2xl"
    } transition-all duration-300`}
  >
    {recommended && (
      <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
        Recommended
      </div>
    )}
    <h3 className="text-2xl font-bold">{title}</h3>
    <p className="text-4xl font-bold mt-4">
      ${price}
      <span className="text-lg font-normal">/mo</span>
    </p>
    <ul className="mt-6 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          {feature.included ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <X className="w-5 h-5 text-red-500" />
          )}
          <span>{feature.text}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={() => onSubscribe(priceId)}
      className={`mt-8 w-full ${
        recommended
          ? "bg-blue-500 hover:bg-blue-600"
          : "bg-[#0A2472] hover:bg-blue-800"
      } text-white rounded-full py-2 transition duration-300`}
    >
      Choose Plan
    </button>
  </div>
);

// Main SubscriptionPage component
const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);

  const tiers = [
    {
      title: "Basic",
      price: 29,
      priceId: "price_1PkPevChwewYxXGK7n8FMom4", // Replace with actual Stripe Price ID
      features: [
        { text: "100 Reviews/month", included: true },
        { text: "Basic Analytics", included: true },
        { text: "Email Support", included: true },
        { text: "AI Insights", included: false },
        { text: "Custom Branding", included: false },
      ],
    },
    {
      title: "Pro",
      price: 79,
      priceId: "price_1PkPfGChwewYxXGKxcZyUGjB", // Replace with actual Stripe Price ID
      features: [
        { text: "500 Reviews/month", included: true },
        { text: "Advanced Analytics", included: true },
        { text: "Priority Support", included: true },
        { text: "AI Insights", included: true },
        { text: "Custom Branding", included: false },
      ],
      recommended: true,
    },
    {
      title: "Enterprise",
      price: 199,
      priceId: "price_1PkPfgChwewYxXGKg1NHDKYf", // Replace with actual Stripe Price ID
      features: [
        { text: "Unlimited Reviews", included: true },
        { text: "Custom Analytics", included: true },
        { text: "24/7 Support", included: true },
        { text: "AI Insights", included: true },
        { text: "Custom Branding", included: true },
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
      console.log(session);
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

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 to-blue-900 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl font-bold text-center text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-center text-white mb-12">
            Unlock the full potential of your customer reviews
          </p>

          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Loader className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <PricingTier
                key={index}
                {...tier}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>

          <p className="text-xl mt-16 text-center text-white max-w-2xl mx-auto">
            Join thousands of businesses already leveraging our AI-driven
            platform to transform customer feedback into actionable insights and
            revenue growth.
          </p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;

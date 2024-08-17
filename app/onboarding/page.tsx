"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Check,
  X,
  Loader2,
  Building,
  CreditCard,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { toast } from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const steps = [
  {
    icon: Building,
    title: "Business Info",
    color: "bg-blue-500",
    key: "businessInfo",
  },
  {
    icon: Share2,
    title: "Connect Platform",
    color: "bg-green-500",
    key: "platform",
  },
  {
    icon: CreditCard,
    title: "Subscription",
    color: "bg-purple-500",
    key: "subscription",
  },
];

const subscriptionPlans = [
  {
    title: "Essential",
    price: 49,
    priceId: "price_1PkPevChwewYxXGK7n8FMom4",
    color: "bg-blue-500",
    features: [
      { text: "1000 Responses/month", included: true },
      { text: "1 Location", included: true },
      { text: "Generate manual reviews", included: true },
      { text: "AI Insights", included: false },
      { text: "Priority Support", included: false },
    ],
  },
  {
    title: "Pro",
    price: 99,
    priceId: "price_1PkPfGChwewYxXGKxcZyUGjB",
    color: "bg-purple-500",
    features: [
      { text: "5000 Responses/month", included: true },
      { text: "5 Locations", included: true },
      { text: "Generate manual reviews", included: true },
      { text: "AI Insights", included: true },
      { text: "Priority Support", included: true },
    ],
  },
];

const platforms = [
  {
    name: "Google Business",
    logo: "/google-logo.png",
    color: "bg-blue-500",
  },
  {
    name: "TripAdvisor",
    logo: "https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg",
    color: "bg-green-500",
    comingSoon: true,
  },
];

const Stepper = ({ currentStep, completedSteps }) => (
  <div className="flex justify-between mb-12">
    {steps.map((step, index) => (
      <div
        key={index}
        className={`flex flex-col items-center ${
          completedSteps[step.key] || index === currentStep
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >
        <div
          className={`w-14 h-14 rounded-full ${
            completedSteps[step.key]
              ? step.color
              : index === currentStep
              ? "bg-blue-200"
              : "bg-gray-200"
          } flex items-center justify-center mb-2 transition-all duration-300`}
        >
          <step.icon
            className={`w-7 h-7 ${
              completedSteps[step.key] || index === currentStep
                ? "text-white"
                : "text-gray-400"
            }`}
          />
        </div>
        <span className="text-sm font-medium">{step.title}</span>
      </div>
    ))}
  </div>
);

export default function SessionBasedOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({
    businessInfo: false,
    platform: false,
    subscription: false,
  });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      const newCompletedSteps = {
        businessInfo: !!(
          user.companyName &&
          user.phoneNumber &&
          user.aboutCompany
        ),
        platform: user.googleBusinessProfileConnected,
        subscription: false, // We'll set this to true only after subscription is complete
      };

      // Set current step based on status
      if (user.status === "subscription") {
        setCurrentStep(2); // Subscription step
        newCompletedSteps.businessInfo = true;
        newCompletedSteps.platform = true;
      } else if (user.status === "platform") {
        setCurrentStep(1); // Connect Platform step
        newCompletedSteps.businessInfo = true;
      } else if (user.status === "incomplete") {
        setCurrentStep(0); // Business Info step
      } else if (user.status === "complete") {
        router.push("/dashboard");
      }

      setCompletedSteps(newCompletedSteps);

      // Prefill form data
      setFormData({
        companyName: user.companyName || "",
        phoneNumber: user.phoneNumber || "",
        aboutCompany: user.aboutCompany || "",
      });
    }
  }, [session]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleConnectPlatform = async (platform) => {
    if (platform.comingSoon) {
      toast.info(`${platform.name} integration coming soon!`);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.echosync.ai/reviews/connect-google-business",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await response.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("Failed to get authorization URL");
      }
    } catch (error) {
      console.error(`Failed to connect ${platform.name}:`, error);
      toast.error(`Failed to connect ${platform.name}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Save business info
      try {
        const response = await fetch("/api/save-business-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to save business info");
        setCompletedSteps({ ...completedSteps, businessInfo: true });
      } catch (error) {
        toast.error("Failed to save business information. Please try again.");
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const renderStepContent = () => {
    // If all steps before the current one are completed, render the current step
    if (steps.slice(0, currentStep).every((step) => completedSteps[step.key])) {
      switch (currentStep) {
        case 0:
          return (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6">
                Tell us about your business
              </h2>
              <div>
                <Label
                  htmlFor="companyName"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="aboutCompany"
                  className="text-sm font-medium text-gray-700"
                >
                  About Your Company
                </Label>
                <Textarea
                  id="aboutCompany"
                  name="aboutCompany"
                  value={formData.aboutCompany}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </motion.div>
          );
        case 1:
          return (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                Connect your platforms
              </h2>
              <div className="space-y-4">
                {platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 flex items-center justify-between bg-white"
                  >
                    <div className="flex items-center">
                      <img
                        src={platform.logo}
                        alt={platform.name}
                        className="w-10 h-10 object-contain mr-4"
                      />
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <Button
                      onClick={() => handleConnectPlatform(platform)}
                      variant={platform.comingSoon ? "outline" : "default"}
                      disabled={platform.comingSoon}
                      className={
                        platform.comingSoon
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    >
                      {platform.comingSoon ? "Coming Soon" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        case 2:
          return (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <h2 className="text-2xl font-bold mb-6">Choose your plan</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {subscriptionPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                    onClick={() => handleSubscribe(plan.priceId)}
                  >
                    <div
                      className={`${plan.color} text-white text-sm font-semibold py-1 px-3 rounded-full inline-block mb-4`}
                    >
                      {plan.title}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      ${plan.price}
                      <span className="text-gray-500 text-lg font-normal">
                        /mo
                      </span>
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          {feature.included ? (
                            <Check className="w-5 h-5 mr-2 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 mr-2 text-red-500" />
                          )}
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-6 ${plan.color} hover:opacity-90 transition-opacity duration-300`}
                    >
                      Select Plan
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
      }
    }
    // If we reach here, it means we're on a step that shouldn't be shown
    // Redirect to dashboard or show a completion message
    router.push("/dashboard");
    return null;
  };

  return (
    <div className="min-h-screen bg-[#181c31] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        <div className="p-8">
          <Stepper currentStep={currentStep} completedSteps={completedSteps} />

          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="w-16 h-16 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}

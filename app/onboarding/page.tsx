"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import {
  Check,
  X,
  Loader2,
  Building,
  CreditCard,
  Share2,
  ChevronRight,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const GoogleLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="32"
    height="32"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const TripAdvisorLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="32"
    height="32"
  >
    <path
      fill="#00AF87"
      d="M23.011 9.532c-.301-3.754-3.3-6.994-6.996-7.27v-.005h-8.03v.005c-3.696.276-6.695 3.516-6.996 7.27h-.815v2.742h2.632l-.166-1.949c.849.309 1.536.99 1.726 1.949h1.108c.25-1.653 1.627-2.912 3.279-2.912s3.029 1.259 3.279 2.912h1.108c.19-.959.877-1.64 1.726-1.949l-.166 1.949h2.632V9.532h-.321zM6.666 13.012c-.057-.014-.113-.023-.166-.037l.166-1.876c1.328.486 2.281 1.771 2.281 3.283 0 1.927-1.541 3.488-3.443 3.488-1.902 0-3.443-1.561-3.443-3.488 0-1.907 1.517-3.454 3.399-3.488l.166 1.876c-.053.014-.109.023-.166.037-.799.222-1.389.957-1.389 1.835 0 1.045.833 1.891 1.863 1.891s1.863-.846 1.863-1.891c0-.878-.59-1.613-1.389-1.835zm13.984 3.371c0 1.927-1.541 3.488-3.443 3.488-1.902 0-3.443-1.561-3.443-3.488 0-1.512.953-2.797 2.281-3.283l.166 1.876c-.053.014-.109.023-.166.037-.799.222-1.389.957-1.389 1.835 0 1.045.833 1.891 1.863 1.891s1.863-.846 1.863-1.891c0-.878-.59-1.613-1.389-1.835-.053-.014-.109-.023-.166-.037l.166-1.876c1.882.034 3.399 1.581 3.399 3.488zm-8.93-3.371c-.057-.014-.113-.023-.166-.037l.166-1.876c1.328.486 2.281 1.771 2.281 3.283 0 1.927-1.541 3.488-3.443 3.488-1.902 0-3.443-1.561-3.443-3.488 0-1.907 1.517-3.454 3.399-3.488l.166 1.876c-.053.014-.109.023-.166.037-.799.222-1.389.957-1.389 1.835 0 1.045.833 1.891 1.863 1.891s1.863-.846 1.863-1.891c0-.878-.59-1.613-1.389-1.835z"
    />
  </svg>
);

const ConnectGoogleCard = ({ onConnect }) => {
  const { data: session, update } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch(
        "https://api.echosync.ai/reviews/connect-google-business",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("Failed to get authorization URL");
      }
    } catch (error) {
      console.error("Failed to connect Google Business:", error);
      toast.error("Failed to connect Google Business. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const isGoogleConnected = session?.user?.googleBusinessProfile?.connected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GoogleLogo />
          <h3 className="text-2xl font-bold text-white">Google Business</h3>
        </div>
        {isGoogleConnected ? (
          <span className="bg-green-400 text-white px-3 py-1 rounded-full text-sm font-medium">
            Connected
          </span>
        ) : null}
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-6">
          Connect your Google Business account to streamline your review
          management process.
        </p>
        {isGoogleConnected ? (
          <div className="flex items-center text-green-500">
            <Check className="w-5 h-5 mr-2" />
            Your Google Business account is connected.
          </div>
        ) : (
          <Button
            onClick={handleGoogleSignIn}
            disabled={isConnecting}
            className="w-full bg-[#181c31] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            {isConnecting ? "Connecting..." : "Connect Google Business"}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const DisabledPlatformCard = ({ Logo, name }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-3xl shadow-2xl overflow-hidden opacity-50"
  >
    <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Logo />
        <h3 className="text-2xl font-bold text-white">{name}</h3>
      </div>
      <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
        Coming Soon
      </span>
    </div>
    <div className="p-6">
      <p className="text-gray-600 mb-6">
        We are working on integrating {name}. <br />
        Stay tuned for updates!
      </p>
      <Button
        disabled
        className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 rounded-full flex items-center justify-center cursor-not-allowed"
      >
        <Lock className="w-5 h-5 mr-2" />
        Not Available Yet
      </Button>
    </div>
  </motion.div>
);

const FancySelectButton = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled,
  isCheckbox,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className={`flex items-center p-4 border rounded-lg transition-all duration-200 ${
        checked
          ? "bg-blue-50 border-blue-500 shadow-md"
          : "bg-white border-gray-200 hover:bg-gray-50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        type={isCheckbox ? "checkbox" : "radio"}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only" // Hide the default input
      />
      <div
        className={`w-6 h-6 mr-4 flex-shrink-0 border-2 ${
          isCheckbox ? "rounded" : "rounded-full"
        } ${
          checked ? "border-blue-500" : "border-gray-300"
        } flex items-center justify-center`}
      >
        {checked && (
          <div
            className={`${
              isCheckbox
                ? "w-4 h-4 bg-blue-500"
                : "w-3 h-3 bg-blue-500 rounded-full"
            }`}
          ></div>
        )}
      </div>
      <div className="flex-grow">
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
      {checked && <Check className="w-5 h-5 text-blue-500 ml-2" />}
    </label>
  </div>
);

const LocationSelectionStep = ({
  locations,
  activatedPlan,
  onLocationSelection,
}) => {
  const [selectedLocations, setSelectedLocations] = useState([]);

  const isEssentialPlan = activatedPlan?.title === "Essential";

  const handleLocationChange = (location) => {
    if (isEssentialPlan) {
      setSelectedLocations([location]);
    } else {
      setSelectedLocations((prev) =>
        prev.some((loc) => loc.name === location.name)
          ? prev.filter((loc) => loc.name !== location.name)
          : [...prev, location],
      );
    }
  };

  const handleSubmit = () => {
    if (selectedLocations.length === 0) {
      toast.error("Please select at least one location.");
      return;
    }
    onLocationSelection(selectedLocations);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Select Location(s)
      </h2>
      <p className="mb-4 text-gray-600">
        {isEssentialPlan
          ? "Please select one location for your Essential plan."
          : "Please select the locations you want to manage."}
      </p>
      <div className="space-y-2">
        {locations.map((location, index) => (
          <FancySelectButton
            key={index}
            id={location.name}
            name="location"
            value={location.name}
            checked={selectedLocations.some(
              (loc) => loc.name === location.name,
            )}
            onChange={() => handleLocationChange(location)}
            label={location.title}
            disabled={
              isEssentialPlan &&
              selectedLocations.length === 1 &&
              !selectedLocations.some((loc) => loc.name === location.name)
            }
            isCheckbox={!isEssentialPlan}
          />
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 w-full"
        disabled={selectedLocations.length === 0}
      >
        Finish Setup
      </Button>
    </motion.div>
  );
};
const steps = [
  {
    icon: Building,
    title: "Business Info",
    color: "bg-blue-500",
    key: "businessInfo",
  },
  {
    icon: CreditCard,
    title: "Subscription",
    color: "bg-purple-500",
    key: "subscription",
  },
  {
    icon: Share2,
    title: "Connect Google",
    color: "bg-green-500",
    key: "connectGoogle",
  },
  {
    icon: CreditCard, // You might want to use a different icon for this step
    title: "Select Location",
    color: "bg-yellow-500",
    key: "selectLocation",
  },
];

const subscriptionPlans = [
  {
    title: "Essential",
    price: 49,
    priceId: "price_1PkPevChwewYxXGK7n8FMom4",
    color: "bg-blue-500",
    freeTrial: 7, // Add this line
    features: [
      { text: "1000 Responses/month", included: true },
      { text: "1 Location", included: true },
      { text: "Generate manual reviews", included: true },
      { text: "AI Insights", included: false },
      { text: "Priority Support", included: false },
    ],
  },
  // Pro plan remains unchanged
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
    subscription: false,
    connectGoogle: false,
    selectLocation: false,
  });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activatedPlan, setActivatedPlan] = useState(null);

  const handleLocationSelection = async (selectedLocations) => {
    try {
      if (
        activatedPlan?.title === "Essential" &&
        selectedLocations.length !== 1
      ) {
        toast.error(
          "Please select exactly one location for the Essential plan.",
        );
        return;
      }

      await fetch(`https://api.echosync.ai/reviews/selected-location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          locations: selectedLocations,
        }),
      });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to save selected location(s). Please try again.");
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    const email = session?.user?.email;

    if (code && email) {
      handleGoogleCallback(code, email);
    }
  }, [searchParams, session]);

  useEffect(() => {
    if (currentStep === 3) {
      fetchLocations(session.user.email);
    }
  }, [currentStep]);

  const handleGoogleCallback = async (code, email) => {
    try {
      const response = await fetch(
        "https://api.echosync.ai/reviews/google-business-callback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, email }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Google Business Profile connected successfully");
        toast.success("Google Business Profile connected successfully");
        await update();
        setCompletedSteps({ ...completedSteps, connectGoogle: true });

        // Fetch locations after successful connection
        await fetchLocations(email);

        // Move to the location selection step instead of dashboard
        setCurrentStep(3);
      } else {
        throw new Error(
          data.error || "Failed to connect Google Business Profile",
        );
      }
    } catch (error) {
      console.error("Error in Google Business callback:", error);
      toast.error(
        "Failed to connect Google Business Profile. Please try again.",
      );
    }
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
          body: JSON.stringify({
            priceId,
            email: session.user.email,
            name: session.user.companyName,
          }),
        },
      );
      const sess = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: sess.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // After successful subscription, update the activated plan
      const selectedPlan = subscriptionPlans.find(
        (plan) => plan.priceId === priceId,
      );
      setActivatedPlan(selectedPlan);
      setCompletedSteps({ ...completedSteps, subscription: true });
      setCurrentStep(2); // Move to the next step
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to initiate subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async (email) => {
    try {
      const response = await fetch(
        `https://api.echosync.ai/reviews/get-locations?email=${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      console.log("Locations:", data);
      setLocations(data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      toast.error("Failed to fetch locations. Please try again.");
    }
  };

  useEffect(() => {
    if (session?.user) {
      const user = session.user;

      const newCompletedSteps = {
        businessInfo: !!(
          user.companyName &&
          user.phoneNumber &&
          user.aboutCompany
        ),
        subscription: !!user.subscription,
        connectGoogle: user.googleBusinessProfileConnected?.connected,
      };

      if (user?.subscription) {
        setActivatedPlan(
          subscriptionPlans.find(
            (plan) => plan.title == user.subscription.subscriptionPlanName,
          ),
        );
      }

      // Set current step based on status
      if (user.status === "complete") {
        // router.push("/dashboard");
      } else if (user.googleBusinessProfileConnected?.connected) {
        setCurrentStep(2); // Connect Google step
        fetchLocations(user.email);
      } else if (user.subscription) {
        setCurrentStep(1); // Subscription step
      } else {
        setCurrentStep(0); // Business Info step
      }

      setCompletedSteps(newCompletedSteps);

      // Prefill form data
      setFormData({
        companyName: user.companyName || "",
        phoneNumber: user.phoneNumber || "",
        aboutCompany: user.aboutCompany || "",
        email: user.email,
        isGoogleUser: user.isGoogleUser,
      });
    }
  }, [session, router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Save business info
      if (
        session.user.aboutCompany !== undefined &&
        session.user.companyName !== undefined &&
        session.user.phoneNumber !== undefined
      ) {
        setCompletedSteps({ ...completedSteps, businessInfo: true });
        setCurrentStep(1);
      } else {
        try {
          const response = await fetch(
            `https://api.echosync.ai/users/complete-google-signup`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            },
          );
          if (!response.ok) throw new Error("Failed to save business info");
          setCompletedSteps({ ...completedSteps, businessInfo: true });
          setCurrentStep(1);
        } catch (error) {
          toast.error("Failed to save business information. Please try again.");
          return;
        }
      }
    } else if (currentStep === 1) {
      // Move to Google connection step
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Save selected location and finish onboarding
      try {
        console.log("Selected location:", locations);
        setCurrentStep(3);

        // await fetch(`https://api.echosync.ai/users/select-location`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ location: selectedLocation }),
        // });
        // router.push("/dashboard");
      } catch (error) {
        toast.error("Failed to save selected location. Please try again.");
      }
    }
  };

  const renderStepContent = () => {
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
            <h2 className="text-2xl font-bold mb-6">Choose your plan</h2>
            {activatedPlan ? (
              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
                role="alert"
              >
                <p className="font-bold">Subscription Activated</p>
                <p>
                  You have successfully subscribed to the {activatedPlan.title}{" "}
                  plan.
                </p>
              </div>
            ) : (
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
                    <div className="w-full flex justify-between">
                      <h3 className="text-2xl font-bold mb-2">
                        ${plan.price}
                        <span className="text-gray-500 text-lg font-normal">
                          /mo
                        </span>
                      </h3>
                      {plan.freeTrial && (
                        <p className="text-green-600 font-semibold mb-2 border border-green-600 rounded-lg px-4 py-2">
                          {plan.freeTrial}-day free trial
                        </p>
                      )}
                    </div>

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
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              Connect Your Platforms
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <ConnectGoogleCard
                onConnect={() =>
                  setCompletedSteps({ ...completedSteps, connectGoogle: true })
                }
              />
              <DisabledPlatformCard Logo={TripAdvisorLogo} name="TripAdvisor" />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <LocationSelectionStep
            locations={locations}
            activatedPlan={activatedPlan}
            onLocationSelection={handleLocationSelection}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#181c31] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        <div className="p-8">
          <Stepper currentStep={currentStep} completedSteps={completedSteps} />

          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {currentStep <= 2 && (
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                Next
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="w-16 h-16 text-white animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

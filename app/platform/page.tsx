"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { BarChart, MessageCircle, Lock } from "lucide-react";
import { Check, ChevronRight, Star } from "lucide-react";
import { connectGoogleBusiness, linkGoogleAccount } from "@/lib/auth-options";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
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

const FacebookLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="32"
    height="32"
  >
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const YelpLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="32"
    height="32"
  >
    <path
      fill="#D32323"
      d="M21.111 18.226c-.141.969-2.119 3.483-3.029 3.847-.311.124-.611.094-.85-.09-.154-.12-.314-.365-2.447-3.827l-.633-1.032c-.244-.37-.199-.857.104-1.229.297-.362.79-.494 1.222-.325.59.213 2.23 1.157 2.507 1.336.276.179.483.413.502.643.002.035.021.341.023.403zm-7.484-1.900c-.375.521-1.124.743-1.733.53-.59-.206-1.033-.814-.989-1.375l.019-.132c.025-.179.114-.682.19-1.132.451-2.65.997-5.846 1.159-6.797.182-1.075.311-1.167.576-1.327.313-.187.746-.187 1.122-.036.513.203 8.808 5.226 8.964 5.332.104.072.198.161.267.263.23.329.186.757-.147 1.139-.56.642-.586.672-5.858 4.288-.009.009-1.975 1.578-2.570 1.999-.157.115-.301.215-.424.295zm-2.658-1.406c.262-.411.454-.896.563-1.417.114-.523.124-1.105-.007-1.665-.28-1.186-1.074-2.206-2.161-2.734-.426-.207-.904-.287-1.369-.223-.55.076-1.045.326-1.433.721l-.001.001c-.921.904-1.378 2.245-1.199 3.562.137 1.003.652 1.913 1.416 2.502l.001.001c1.435 1.114 3.444.895 4.69-.398.174-.182.323-.388.445-.611z"
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

const ConnectGoogleCard = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const email = session?.user?.email;

    if (code && email) {
      handleGoogleCallback(code, email);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch(
        "http://echosync-backend-new-env.eba-2bqygaft.us-east-1.elasticbeanstalk.com/reviews/connect-google-business",
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
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoogleCallback = async (code, email) => {
    try {
      const response = await fetch(
        "http://echosync-backend-new-env.eba-2bqygaft.us-east-1.elasticbeanstalk.com/reviews/google-business-callback",
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
        // Update the session to reflect the new connection status
        await update();
      } else {
        throw new Error(
          data.error || "Failed to connect Google Business Profile",
        );
      }
    } catch (error) {
      console.error("Error in Google Business callback:", error);
    }
  };

  const isGoogleConnected = session?.user?.googleBusinessProfile?.connected;
  console.log(session);
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
          <span>
            <div className="flex items-center text-green-500">
              <Check className="w-5 h-5 mr-2" />
              Your Google Business account is connected.
              <span
                onClick={() => {
                  router.push("/dashboard");
                }}
                className="text-blue-500 underline cursor-pointer "
              >
                Go to dashboard
              </span>
            </div>
          </span>
        ) : (
          <button
            onClick={() => {
              // signIn("google", {
              //   callbackUrl: "/platform",
              //   platform_signin: "true",
              // });
              handleGoogleSignIn();
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            Connect Google Business
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
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
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 rounded-full flex items-center justify-center cursor-not-allowed"
      >
        <Lock className="w-5 h-5 mr-2" />
        Not Available Yet
      </button>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-6"
  >
    <Icon className="w-8 h-8 text-purple-400 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const ConnectPlatformsPage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-purple-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Supercharge Your{" "}
            <span className="text-purple-400">Online Reputation</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect your review platforms and take control of your online
            presence in one place.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <ConnectGoogleCard />
          {/* <DisabledPlatformCard Logo={FacebookLogo} name="Facebook" />
          <DisabledPlatformCard Logo={YelpLogo} name="Yelp" /> */}
          <DisabledPlatformCard Logo={TripAdvisorLogo} name="TripAdvisor" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Star}
            title="Centralized Reviews"
            description="Access all your reviews in one dashboard for easy management."
          />
          <FeatureCard
            icon={MessageCircle}
            title="AI-Powered Responses"
            description="Respond to reviews quickly with AI-generated suggestions."
          />
          <FeatureCard
            icon={BarChart}
            title="Insightful Analytics"
            description="Gain valuable insights from your review data to improve your business."
          />
        </div>
      </div>
    </div>
  );
};

export default ConnectPlatformsPage;

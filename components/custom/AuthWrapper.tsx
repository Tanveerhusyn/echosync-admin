"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  session: any;
}

export default function AuthWrapper({ children, session }: AuthWrapperProps) {
  const router = useRouter();

  useEffect(() => {
    if (
      session?.user?.needsBusinessInfo == false &&
      session?.user?.googleBusinessProfileConnected?.connected == true
    ) {
      router.push("/dashboard");
    } else if (session?.user?.needsBusinessInfo == false) {
      router.push("/platform");

      console.log("redirecting to /connect-google-business", session);
    } else if (session?.user?.needsBusinessInfo == true) {
      router.push("/business-info");

      console.log("redirecting to /business-info", session);
    } else if (
      session != null &&
      !session?.user?.googleBusinessProfileConnected
    ) {
      router.push("/platform");

      console.log("redirecting to /platform", session);
    }

    console.log("session inside wrapper", session);
  }, [session, router]);

  //   if (!session) {
  //     return (
  //       <div className="flex justify-center items-center h-screen">
  //         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //         <span>Loading...</span>
  //       </div>
  //     );
  //   }

  return <>{children}</>;
}

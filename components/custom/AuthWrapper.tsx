"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  session: any;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/onboarding");
      // if (session.user.status === "incomplete") {
      //   router.push("/business-info");
      // } else if (session.user.status === "subscription") {
      //   router.push("/subscription");
      // } else if (session.user.status === "complete") {
      //   router.push("/dashboard");
      // } else if (session.user.status === "platform") {
      //   router.push("/platform");
      // }
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

"use client";

import { SessionProvider } from "next-auth/react";

import React from "react";

const Providers = ({ children, session }) => {
  // if (!session) {
  //   signOut();
  // }
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Providers;

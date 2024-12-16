"use client";

import { useEffect } from "react";

export default function Home() {

  const fetchUser = async () => {
    const data = await fetch("/api/users");
    console.log(data);
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
    </>
  );
}
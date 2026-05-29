"use client";

import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = any>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          } else {
            entry.target.classList.remove("in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const reveals = ref.current.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    if (ref.current.classList.contains("reveal")) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
}

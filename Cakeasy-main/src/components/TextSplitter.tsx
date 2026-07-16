import React, { useEffect, useRef, useState } from 'react';

interface TextSplitterProps {
  text: string;
  className?: string;
  delayOffset?: number; // base delay in ms
}

export default function TextSplitter({ text, className = '', delayOffset = 0 }: TextSplitterProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const words = text.split(' ');

  return (
    <div
      id={`split-${Math.random().toString(36).substr(2, 9)}`}
      ref={containerRef}
      className={`inline-block overflow-hidden ${className}`}
    >
      {isInView ? (
        words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split('').map((char, charIndex) => {
              const globalIndex = words.slice(0, wordIndex).join('').length + charIndex;
              const delay = delayOffset + globalIndex * 25; // 25ms stagger per char
              return (
                <span
                  key={charIndex}
                  className="split-char inline-block"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))
      ) : (
        <span className="opacity-0">{text}</span>
      )}
    </div>
  );
}

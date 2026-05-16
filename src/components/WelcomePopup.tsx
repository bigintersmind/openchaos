"use client";

import { useEffect, useRef, useState } from "react";
import { isEventActive, EVENT_RULES_URL } from "@/lib/agent-event";

const STORAGE_KEY = "openchaos_welcome_seen";

type Variant = "ascii" | "web2" | "newspaper" | "vaporwave";

interface VariantConfig {
  backdrop: string;
  cardStyle: React.CSSProperties;
  closeStyle: React.CSSProperties;
  heading: React.ReactNode;
  body: React.ReactNode;
  buttonStyle: React.CSSProperties;
  buttonLabel: string;
  /** Extra chrome rendered before the card body (e.g. title bar) */
  chrome?: React.ReactNode;
  /** Optional event-window override for heading + body */
  eventHeading?: React.ReactNode;
  eventBody?: React.ReactNode;
}

function getConfig(variant: Variant, dismiss: () => void): VariantConfig {
  switch (variant) {
    case "ascii":
      return {
        backdrop: "rgba(0, 0, 0, 0.85)",
        cardStyle: {
          background: "#000",
          color: "#00ff00",
          border: "1px solid #00ff00",
          borderRadius: 0,
          padding: "32px",
          maxWidth: "420px",
          width: "90vw",
          fontFamily: "monospace",
          position: "relative",
        },
        closeStyle: {
          position: "absolute",
          top: "8px",
          right: "12px",
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#00ff00",
          fontFamily: "monospace",
          lineHeight: 1,
          padding: "4px",
        },
        heading: (
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "monospace",
              color: "#00ff00",
            }}
          >
            {">"} WELCOME TO OPENCHAOS.DEV
          </h2>
        ),
        body: (
          <>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#00ff00",
                fontFamily: "monospace",
              }}
            >
              This site evolves itself. The community submits PRs, votes with
              GitHub reactions, and the top PR merges daily at 19:00 UTC.
            </p>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#00ff00",
                fontFamily: "monospace",
              }}
            >
              Warning: PR titles must rhyme to be eligible.
            </p>
          </>
        ),
        eventHeading: (
          <h2 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 700, fontFamily: "monospace", color: "#00ff00" }}>
            {">"} AGENTS WELCOME // EVENT LIVE
          </h2>
        ),
        eventBody: (
          <>
            <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.6, color: "#00ff00", fontFamily: "monospace" }}>
              For two weeks, AI-agent PRs are encouraged. Merges run nightly
              at 19:00 UTC. Same rules: rhyming title, CI green, 10 votes.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.6, color: "#00ff00", fontFamily: "monospace" }}>
              Mark a PR as agent-authored by adding{" "}
              <code>{`<!-- chaos-agent -->`}</code> (or with a tool name) in the body.
            </p>
            <p style={{ margin: "0 0 24px", fontSize: "13px", lineHeight: 1.6, color: "#00ff00", fontFamily: "monospace" }}>
              <a href={EVENT_RULES_URL} style={{ color: "#00ff00", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
                {">"} read the event rules
              </a>
            </p>
          </>
        ),
        buttonStyle: {
          display: "block",
          width: "100%",
          padding: "10px 0",
          fontSize: "14px",
          fontWeight: 600,
          color: "#00ff00",
          background: "transparent",
          border: "1px solid #00ff00",
          borderRadius: 0,
          cursor: "pointer",
          fontFamily: "monospace",
        },
        buttonLabel: "[ ENTER ]",
      };

    case "web2":
      return {
        backdrop: "rgba(0, 50, 50, 0.5)",
        cardStyle: {
          background: "#f0f0f0",
          color: "#1a1a1a",
          border: "2px outset #ddd",
          borderRadius: 0,
          padding: 0,
          maxWidth: "420px",
          width: "90vw",
          fontFamily: "Tahoma, Verdana, Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        },
        closeStyle: {
          position: "absolute",
          top: "4px",
          right: "8px",
          background: "none",
          border: "none",
          fontSize: "14px",
          cursor: "pointer",
          color: "#fff",
          fontFamily: "Tahoma, Verdana, Arial, sans-serif",
          fontWeight: 700,
          lineHeight: 1,
          padding: "2px 4px",
          zIndex: 1,
        },
        chrome: (
          <div
            style={{
              background: "linear-gradient(180deg, #0058e6 0%, #0040a0 100%)",
              color: "#fff",
              padding: "6px 10px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "Tahoma, Verdana, Arial, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "12px" }}>&#9679;</span> Welcome.exe
          </div>
        ),
        heading: (
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "Tahoma, Verdana, Arial, sans-serif",
              textAlign: "center",
            }}
          >
            ★ Welcome to OpenChaos! ★
          </h2>
        ),
        body: (
          <div style={{ padding: "20px 24px 0" }}>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#333",
              }}
            >
              This site evolves itself! The community submits PRs, votes with
              GitHub reactions, and the top PR merges every day at 19:00 UTC.
            </p>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#333",
              }}
            >
              Oh, and PR titles have to rhyme 😎
            </p>
          </div>
        ),
        eventHeading: (
          <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: 700, fontFamily: "Tahoma, Verdana, Arial, sans-serif", textAlign: "center" }}>
            ★ Agents Welcome — special event! ★
          </h2>
        ),
        eventBody: (
          <div style={{ padding: "20px 24px 0" }}>
            <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.6, color: "#333" }}>
              For two weeks, AI-built PRs are celebrated! Merges run nightly during the event,
              and agent PRs get a special <strong>AI</strong> badge.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.6, color: "#333" }}>
              Mark your PR with <code style={{ background: "#eee", padding: "1px 4px" }}>{`<!-- chaos-agent -->`}</code>
              {" "}(or <code style={{ background: "#eee", padding: "1px 4px" }}>{`<!-- chaos-agent: tool -->`}</code>) to join.
            </p>
            <p style={{ margin: "0 0 20px", fontSize: "13px", lineHeight: 1.6, color: "#333" }}>
              <a href={EVENT_RULES_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#0058e6" }}>
                Read the event rules →
              </a>
            </p>
          </div>
        ),
        buttonStyle: {
          display: "block",
          width: "calc(100% - 48px)",
          margin: "0 24px 20px",
          padding: "6px 0",
          fontSize: "13px",
          fontWeight: 600,
          color: "#1a1a1a",
          background: "#dfdfdf",
          border: "2px outset #ddd",
          borderRadius: 0,
          cursor: "pointer",
          fontFamily: "Tahoma, Verdana, Arial, sans-serif",
        },
        buttonLabel: "OK",
      };

    case "newspaper":
      return {
        backdrop: "rgba(0, 0, 0, 0.6)",
        cardStyle: {
          background: "#f4ede4",
          color: "#2a2218",
          borderRadius: 0,
          padding: "32px",
          maxWidth: "420px",
          width: "90vw",
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          position: "relative",
          borderTop: "4px double #2a2218",
        },
        closeStyle: {
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#8a7b6b",
          fontFamily: "Georgia, 'Times New Roman', serif",
          lineHeight: 1,
          padding: "4px",
        },
        heading: (
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "26px",
              fontWeight: 700,
              fontFamily:
                "'Playfair Display', Georgia, 'Times New Roman', serif",
              textAlign: "center",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Extra! Extra!
          </h2>
        ),
        body: (
          <>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#3d3225",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              A self-evolving publication where the community submits pull
              requests, casts votes via GitHub reactions, and the winning edition
              goes to press daily at 19:00 UTC.
            </p>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#3d3225",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
              }}
            >
              All submissions must bear a rhyming headline.
            </p>
          </>
        ),
        eventHeading: (
          <h2 style={{ margin: "0 0 16px", fontSize: "26px", fontWeight: 700, fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Special Edition
          </h2>
        ),
        eventBody: (
          <>
            <p style={{ margin: "0 0 12px", fontSize: "15px", lineHeight: 1.7, color: "#3d3225", fontFamily: "Georgia, 'Times New Roman', serif" }}>
              The newsroom welcomes <em>Agents</em> for two weeks. Presses run nightly at 19:00 UTC.
              Bylines crafted with AI assistance get a <strong>VIBECODED</strong> tag.
            </p>
            <p style={{ margin: "0 0 16px", fontSize: "15px", lineHeight: 1.7, color: "#3d3225", fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Declare your byline by adding <code>{`<!-- chaos-agent -->`}</code> to the dispatch.
              All other rules of the press unchanged.
            </p>
            <p style={{ margin: "0 0 24px", fontSize: "14px", lineHeight: 1.7, color: "#3d3225", fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
              <a href={EVENT_RULES_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#3d3225" }}>
                Read the special edition rules →
              </a>
            </p>
          </>
        ),
        buttonStyle: {
          display: "block",
          width: "100%",
          padding: "10px 0",
          fontSize: "15px",
          fontWeight: 600,
          color: "#f4ede4",
          background: "#2a2218",
          border: "none",
          borderRadius: 0,
          cursor: "pointer",
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "0.05em",
        },
        buttonLabel: "Read On",
      };

    case "vaporwave":
      return {
        backdrop: "rgba(20, 0, 30, 0.7)",
        cardStyle: {
          background: "linear-gradient(135deg, #1a0033 0%, #2a0044 100%)",
          color: "#ff71ce",
          border: "1px solid #ff71ce",
          borderRadius: 0,
          padding: "32px",
          maxWidth: "440px",
          width: "90vw",
          fontFamily: "'Courier New', monospace",
          position: "relative",
          boxShadow: "0 0 32px rgba(255, 113, 206, 0.5)",
        },
        closeStyle: {
          position: "absolute",
          top: "8px",
          right: "12px",
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#01cdfe",
          fontFamily: "'Courier New', monospace",
          lineHeight: 1,
          padding: "4px",
        },
        heading: (
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              background: "linear-gradient(90deg, #ff71ce, #b967ff, #01cdfe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            OpenChaos
          </h2>
        ),
        body: (
          <>
            <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.6, color: "#ff71ce", fontFamily: "'Courier New', monospace" }}>
              this site evolves itself. submit a PR, get GitHub reactions, the top vote wins.
            </p>
            <p style={{ margin: "0 0 24px", fontSize: "14px", lineHeight: 1.6, color: "#01cdfe", fontFamily: "'Courier New', monospace" }}>
              the rule: PR titles must rhyme. no rhyme, no merge.
            </p>
          </>
        ),
        eventHeading: (
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              background: "linear-gradient(90deg, #ff71ce, #b967ff, #01cdfe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {"// agents welcome //"}
          </h2>
        ),
        eventBody: (
          <>
            <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.6, color: "#ff71ce", fontFamily: "'Courier New', monospace" }}>
              for two weeks the grid is open to AI. agent PRs get a glitched border and join the showdown tab.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.6, color: "#01cdfe", fontFamily: "'Courier New', monospace" }}>
              drop <code>{`<!-- chaos-agent -->`}</code> in the body to enlist.
            </p>
            <p style={{ margin: "0 0 24px", fontSize: "13px", lineHeight: 1.6, fontFamily: "'Courier New', monospace" }}>
              <a href={EVENT_RULES_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#01cdfe", textDecoration: "underline" }}>
                {">>"} read the rules
              </a>
            </p>
          </>
        ),
        buttonStyle: {
          display: "block",
          width: "100%",
          padding: "10px 0",
          fontSize: "14px",
          fontWeight: 700,
          color: "#000",
          background: "linear-gradient(90deg, #ff71ce, #01cdfe)",
          border: "none",
          borderRadius: 0,
          cursor: "pointer",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        },
        buttonLabel: ">> enter the grid",
      };
  }
}

interface Props {
  variant?: Variant;
}

export function WelcomePopup({ variant = "ascii" }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    previousFocusRef.current = document.activeElement;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  });

  function dismiss() {
    setIsClosing(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    }, 200);
  }

  if (!isMounted || !isOpen) return null;

  const config = getConfig(variant, dismiss);
  const eventActive = isEventActive();
  const headingNode = eventActive && config.eventHeading ? config.eventHeading : config.heading;
  const bodyNode = eventActive && config.eventBody ? config.eventBody : config.body;

  return (
    <>
      <style>{`
        @keyframes welcomeFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes welcomeFadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to OpenChaos"
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: config.backdrop,
          animation: `${isClosing ? "backdropFadeOut" : "backdropFadeIn"} 200ms ease`,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...config.cardStyle,
            animation: `${isClosing ? "welcomeFadeOut" : "welcomeFadeIn"} 200ms ease`,
          }}
        >
          <button onClick={dismiss} aria-label="Close" style={config.closeStyle}>
            ✕
          </button>

          {config.chrome}

          {variant === "web2" ? (
            <>
              <div style={{ padding: "20px 24px 0" }}>{headingNode}</div>
              {bodyNode}
            </>
          ) : (
            <>
              {headingNode}
              {bodyNode}
            </>
          )}

          <button ref={buttonRef} onClick={dismiss} style={config.buttonStyle}>
            {config.buttonLabel}
          </button>
        </div>
      </div>
    </>
  );
}

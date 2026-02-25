"use client";
import { useState, useEffect, useRef } from "react";

/*
  Aevio — aevio.ai
  AEO Agents for Japan & Asia
  
  Design: Editorial minimal, warm light theme.
  Inspired by Profound's structure but differentiated:
  - Profound: "Marketing agents to win in [platforms]" for Fortune 500
  - Aevio: "AI検索を、エージェントが最適化する。" for Japan/Asia SMB-Enterprise
  
  Sections: Nav → Hero (agent-forward) → Platform ticker → Problem → Agent workflow → Why Japan → CTA → Footer
*/

const AI_PLATFORMS = [
  "ChatGPT", "Gemini", "Perplexity", "Claude", 
  "Google AI Overviews", "LINE AI", "Yahoo! JAPAN AI", "Grok", "DeepSeek"
];

const TYPING_PROMPTS = [
  { text: "おすすめの化粧水は？", delay: 65 },
  { text: "転職エージェント 比較", delay: 70 },
  { text: "CRMツール 中小企業向け", delay: 55 },
];

function useTypingEffect() {
  const [displayText, setDisplayText] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const prompt = TYPING_PROMPTS[promptIdx];
    if (phase === "typing") {
      if (charIdx < prompt.text.length) {
        const t = setTimeout(() => {
          setDisplayText(prompt.text.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        }, prompt.delay);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 2200);
        return () => clearTimeout(t);
      }
    }
    if (phase === "pause") {
      const t = setTimeout(() => setPhase("erasing"), 300);
      return () => clearTimeout(t);
    }
    if (phase === "erasing") {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplayText(prompt.text.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        }, 25);
        return () => clearTimeout(t);
      } else {
        setPromptIdx((promptIdx + 1) % TYPING_PROMPTS.length);
        setPhase("typing");
      }
    }
  }, [charIdx, phase, promptIdx]);

  return displayText;
}

/* Rotating platform name in hero */
function useRotatingText(items, interval = 2200) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % items.length);
        setVisible(true);
      }, 300);
    }, interval);
    return () => clearInterval(cycle);
  }, [items.length, interval]);

  return { text: items[index], visible };
}

/* Horizontal scrolling ticker for AI platforms */
function PlatformTicker() {
  const doubled = [...AI_PLATFORMS, ...AI_PLATFORMS];
  return (
    <div style={{
      overflow: "hidden", padding: "28px 0",
      borderTop: "1px solid rgba(0,0,0,0.05)",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <div style={{
        display: "flex", gap: 56, whiteSpace: "nowrap",
        animation: "ticker 28s linear infinite",
      }}>
        {doubled.map((name, i) => (
          <span key={i} style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 13, fontWeight: 500, color: "#bbb",
            letterSpacing: "0.04em", flexShrink: 0,
          }}>{name}</span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* --- Agent Workflow Visualization --- */
function AgentStep({ num, label, desc, active }) {
  return (
    <div style={{
      flex: 1, padding: "28px 24px",
      background: active ? "#17181C" : "transparent",
      borderRadius: 12,
      transition: "all 0.5s ease",
      cursor: "default",
    }}>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 13, fontStyle: "italic",
        color: active ? "#6EE7A0" : "#ccc",
        marginBottom: 12,
      }}>{num}</div>
      <div style={{
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: 17, fontWeight: 700,
        color: active ? "#fff" : "#1a1a1a",
        marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: 13, lineHeight: 1.8,
        color: active ? "rgba(255,255,255,0.55)" : "#999",
      }}>{desc}</div>
    </div>
  );
}

function AgentWorkflow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { num: "01", label: "監視する", desc: "9つのAIプラットフォームでブランドの引用状況を24時間モニタリング。変化があれば即座に検知。" },
    { num: "02", label: "分析する", desc: "日本語の形態素解析でプロンプトを理解。なぜ引用されないのか、原因を構造的に特定。" },
    { num: "03", label: "実行する", desc: "コンテンツ構造の改善、Schema Markupの最適化、FAQ生成をエージェントが自動で適用。" },
  ];

  return (
    <div style={{
      display: "flex", gap: 8,
      background: "#F5F3EF", borderRadius: 16, padding: 8,
    }}>
      {steps.map((s, i) => (
        <AgentStep key={s.num} {...s} active={i === active} />
      ))}
    </div>
  );
}

/* --- Sections --- */

function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "18px 40px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "rgba(252,250,247,0.88)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Orbit mark */}
        <svg width="28" height="28" viewBox="-32 -32 64 64" fill="none">
          <circle cx="0" cy="0" r="24" stroke="#17181C" strokeWidth="2.5" opacity="0.18"/>
          <circle cx="0" cy="0" r="8" fill="#17181C"/>
          <circle cx="20" cy="-14" r="5.5" fill="#6EE7A0"/>
          <path d="M 22 -4 Q 24 -10, 20 -14" stroke="#6EE7A0" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
        </svg>
        <span style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 18, fontWeight: 600, color: "#1a1a1a",
          letterSpacing: "-0.03em",
        }}>
          Aevio
        </span>
      </div>
      <a href="#contact" style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 13, fontWeight: 500, color: "#FCFAF7",
        padding: "10px 24px",
        background: "#17181C", borderRadius: 100,
        textDecoration: "none", cursor: "pointer",
        transition: "opacity 0.3s ease",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        無料診断を受ける
      </a>
    </nav>
  );
}

function Hero() {
  const typedText = useTypingEffect();
  const rotating = useRotatingText(AI_PLATFORMS, 2000);

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "140px 40px 60px",
      maxWidth: 960, margin: "0 auto",
    }}>
      <div style={{ marginBottom: 56 }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
          color: "#6EE7A0", textTransform: "uppercase", marginBottom: 32,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", background: "#6EE7A0",
            animation: "pulse-dot 2s ease-in-out infinite",
          }} />
          AEO Agents for Japan
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Noto Serif JP', serif",
          fontSize: "clamp(38px, 6vw, 64px)",
          fontWeight: 400,
          lineHeight: 1.18,
          letterSpacing: "-0.03em",
          color: "#1a1a1a",
          margin: "0 0 24px",
          maxWidth: 720,
        }}>
          <span style={{
            display: "inline-block",
            minWidth: 260,
            color: "#17181C",
            borderBottom: "2px solid #6EE7A0",
            paddingBottom: 2,
            transition: "opacity 0.3s ease",
            opacity: rotating.visible ? 1 : 0,
          }}>{rotating.text}</span>
          <span style={{ color: "#999" }}>で</span>
          <br />
          あなたのブランドが選ばれる。
          <br />
          <span style={{ fontStyle: "italic", color: "#17181C" }}>自動で。</span>
        </h1>
        <p style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: 16, color: "#888", lineHeight: 2,
          maxWidth: 520, margin: 0,
        }}>
          Aevio（エイビオ）のAIエージェントが、あなたのコンテンツを監視・分析・最適化。ChatGPTからLINE AIまで、日本のAI検索を一括でカバーします。
        </p>
      </div>

      {/* Two-column: CTA left, AI demo right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
          <a href="#contact" style={{
            fontFamily: "'Sora', 'Noto Sans JP', sans-serif",
            fontSize: 15, fontWeight: 600,
            padding: "16px 36px",
            background: "#17181C", color: "#FCFAF7",
            border: "none", borderRadius: 100,
            textDecoration: "none", cursor: "pointer",
            display: "inline-block", textAlign: "center",
            transition: "opacity 0.25s ease",
            alignSelf: "flex-start",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            無料でブランド診断する
          </a>
          <span style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12, color: "#bbb",
          }}>
            先着20社 — 3営業日でレポート
          </span>
        </div>

        {/* AI search demo */}
        <div style={{
          background: "#17181C", borderRadius: 14, padding: "24px 28px",
          position: "relative", overflow: "hidden",
          boxShadow: "0 32px 64px rgba(0,0,0,0.08)",
        }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6EE7A0" }} />
            ChatGPT
          </div>
          <div style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 20,
            minHeight: 24,
          }}>
            {typedText}
            <span style={{
              display: "inline-block", width: 2, height: 18,
              background: "rgba(255,255,255,0.5)",
              marginLeft: 1, verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }} />
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <p style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 2, margin: 0,
            }}>
              おすすめは
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}> A社</span>、
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>B社</span>、
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>C社</span>
              の3つです。
              <br />
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12 }}>
                あなたのブランドは言及されていません。
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </section>
  );
}

function Problem() {
  return (
    <section style={{
      padding: "120px 40px",
      maxWidth: 960, margin: "0 auto",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
        <div>
          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
            color: "#bbb", textTransform: "uppercase", marginBottom: 24,
          }}>The Shift</p>
          <p style={{
            fontFamily: "'Instrument Serif', 'Noto Serif JP', serif",
            fontSize: 30, lineHeight: 1.55, color: "#1a1a1a",
            fontWeight: 400, margin: 0,
          }}>
            消費者はもう
            <br />
            Googleで検索していない。
            <br />
            <span style={{ color: "#999" }}>AIに聞いている。</span>
          </p>
        </div>
        <div style={{ paddingTop: 6 }}>
          <p style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 15, lineHeight: 2.2, color: "#777", margin: "0 0 20px",
          }}>
            日本の10代の42.9%がChatGPTで検索。Yahoo! JAPANを超えた。Gartnerは従来の検索トラフィックが25%減少すると予測。
          </p>
          <p style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 15, lineHeight: 2.2, color: "#777", margin: "0 0 20px",
          }}>
            AI検索で推薦されないブランドは、存在しないのと同じ。しかし、日本にはこの問題に対応するツールがまだない。
          </p>
          <p style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 15, lineHeight: 2.2, color: "#777", margin: 0,
          }}>
            海外ツールは英語前提。LINE AI、Yahoo! JAPAN AIには非対応。日本語の形態素解析もできない。
          </p>
        </div>
      </div>
    </section>
  );
}

function Agent() {
  return (
    <section style={{
      padding: "120px 40px",
      maxWidth: 960, margin: "0 auto",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    }}>
      <div style={{ marginBottom: 56 }}>
        <p style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
          color: "#6EE7A0", textTransform: "uppercase", marginBottom: 24,
        }}>Aevio Agents</p>
        <h2 style={{
          fontFamily: "'Instrument Serif', 'Noto Serif JP', serif",
          fontSize: 34, fontWeight: 400, lineHeight: 1.4,
          color: "#1a1a1a", margin: "0 0 16px", letterSpacing: "-0.02em",
          maxWidth: 560,
        }}>
          分析で終わらない。
          <br />
          エージェントが、実行する。
        </h2>
        <p style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: 15, color: "#999", lineHeight: 2,
          maxWidth: 480, margin: 0,
        }}>
          Aevioは監視ダッシュボードではありません。あなたのブランドが AI に選ばれるよう、エージェントが自律的に動き続けます。
        </p>
      </div>
      <AgentWorkflow />
    </section>
  );
}

function Coverage() {
  const platforms = [
    { name: "ChatGPT", region: "Global", share: "82%" },
    { name: "Gemini", region: "Global", share: "5%" },
    { name: "Perplexity", region: "Global", share: "6%" },
    { name: "Claude", region: "Global", share: "—" },
    { name: "Google AI Overviews", region: "Global", share: "—" },
    { name: "LINE AI", region: "Japan", share: "96M users" },
    { name: "Yahoo! JAPAN AI", region: "Japan", share: "—" },
    { name: "Naver", region: "Korea", share: "—" },
    { name: "Baidu", region: "China", share: "—" },
  ];

  return (
    <section style={{
      padding: "120px 40px",
      maxWidth: 960, margin: "0 auto",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 80 }}>
        <div>
          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
            color: "#bbb", textTransform: "uppercase", marginBottom: 24,
          }}>Coverage</p>
          <p style={{
            fontFamily: "'Instrument Serif', 'Noto Serif JP', serif",
            fontSize: 28, lineHeight: 1.5, color: "#1a1a1a",
            fontWeight: 400, margin: "0 0 16px",
          }}>
            グローバルツールの
            <br />
            死角をカバーする。
          </p>
          <p style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 14, color: "#999", lineHeight: 1.9, margin: 0,
          }}>
            日本語の形態素解析に対応。アジア固有のAIプラットフォームを含む9つのエンジンを一括で監視します。
          </p>
        </div>
        <div>
          {platforms.map((p, i) => (
            <div key={p.name} style={{
              display: "grid", gridTemplateColumns: "1fr 80px 90px",
              padding: "14px 0",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              alignItems: "center",
            }}>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14, fontWeight: 500, color: "#1a1a1a",
              }}>{p.name}</span>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 11, fontWeight: 500, color: p.region === "Japan" || p.region === "Korea" || p.region === "China" ? "#6EE7A0" : "#ccc",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>{p.region}</span>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 12, color: "#999",
                textAlign: "right",
              }}>{p.share}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Vs() {
  return (
    <section style={{
      padding: "120px 40px",
      maxWidth: 960, margin: "0 auto",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    }}>
      <p style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
        color: "#bbb", textTransform: "uppercase", marginBottom: 48,
      }}>Why Aevio</p>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 0, borderRadius: 16, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
      }}>
        {/* Competitor side */}
        <div style={{ padding: "40px 36px", background: "#F5F3EF" }}>
          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12, fontWeight: 600, color: "#bbb",
            marginBottom: 28, letterSpacing: "0.06em",
          }}>海外AEOツール</p>
          {[
            "英語中心のプロンプト分析",
            "LINE AI / Yahoo! JAPAN AI 非対応",
            "モニタリングのみ、実行は別途",
            "エンタープライズ価格（$499〜/月）",
          ].map(item => (
            <div key={item} style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14, color: "#aaa", lineHeight: 1.8,
              padding: "10px 0",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
            }}>{item}</div>
          ))}
        </div>
        {/* Aevio side */}
        <div style={{ padding: "40px 36px", background: "#17181C" }}>
          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12, fontWeight: 600, color: "#6EE7A0",
            marginBottom: 28, letterSpacing: "0.06em",
          }}>Aevio</p>
          {[
            "日本語ネイティブの形態素解析",
            "LINE AI / Yahoo! JAPAN AI / Naver対応",
            "エージェントが分析から実行まで自動",
            "¥29,800〜/月のSMB対応価格",
          ].map(item => (
            <div key={item} style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8,
              padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>{item}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const inputStyle = {
    fontFamily: "'Sora', 'Noto Sans JP', sans-serif",
    fontSize: 15, padding: "16px 0", width: "100%",
    background: "transparent", border: "none",
    borderBottom: "1.5px solid rgba(255,255,255,0.15)",
    color: "#fff", outline: "none",
    transition: "border-color 0.25s ease",
  };

  async function handleSubmit() {
    if (!url || !email) return;
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "4434d0c4-c9ad-46f8-a0c1-5deafff00538",
          subject: "【Aevio】新規無料診断申込",
          from_name: "Aevio LP",
          website_url: url,
          email: email,
        }),
      });
      if (res.ok) setSent(true);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  }

  return (
    <section id="contact" style={{
      background: "#17181C",
      padding: "120px 40px",
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
              color: "#6EE7A0", textTransform: "uppercase", marginBottom: 28,
            }}>
              Free Diagnosis — 先着20社
            </p>
            <h2 style={{
              fontFamily: "'Instrument Serif', 'Noto Serif JP', serif",
              fontSize: 32, fontWeight: 400, lineHeight: 1.4,
              color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em",
            }}>
              AIはあなたの
              <br />
              ブランドをどう語るか。
            </h2>
            <p style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 2, margin: 0,
            }}>
              URLを送るだけ。ChatGPT・Gemini・Perplexityでの引用状況、競合比較、改善提案を3営業日でレポートします。
            </p>
          </div>

          <div style={{ paddingTop: 32 }}>
            {!sent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <input
                  type="url" placeholder="https://your-site.jp"
                  value={url} onChange={e => setUrl(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = "#6EE7A0"}
                  onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.15)"}
                />
                <input
                  type="email" placeholder="you@company.jp"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = "#6EE7A0"}
                  onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.15)"}
                />
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{
                    fontFamily: "'Sora', 'Noto Sans JP', sans-serif",
                    fontSize: 15, fontWeight: 600,
                    padding: "16px 40px",
                    background: sending ? "#555" : "#6EE7A0",
                    color: "#17181C",
                    border: "none", borderRadius: 100,
                    cursor: sending ? "default" : "pointer",
                    marginTop: 8,
                    alignSelf: "flex-start",
                    transition: "opacity 0.25s ease",
                  }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {sending ? "送信中..." : "無料診断を申し込む"}
                </button>
              </div>
            ) : (
              <div>
                <p style={{
                  fontFamily: "'Instrument Serif', 'Noto Serif JP', serif",
                  fontSize: 24, color: "#fff", margin: "0 0 8px",
                }}>ありがとうございます。</p>
                <p style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.9, margin: 0,
                }}>3営業日以内に診断レポートをお届けします。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#17181C",
      padding: "32px 40px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="22" height="22" viewBox="-32 -32 64 64" fill="none">
            <circle cx="0" cy="0" r="24" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5"/>
            <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.6)"/>
            <circle cx="20" cy="-14" r="5.5" fill="#6EE7A0"/>
            <path d="M 22 -4 Q 24 -10, 20 -14" stroke="#6EE7A0" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
          </svg>
          <span style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.6)",
          }}>Aevio</span>
        </div>
        <span style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11, color: "rgba(255,255,255,0.2)",
        }}>
          © 2026 aevio.ai
        </span>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "#FCFAF7", color: "#1a1a1a" }}>
      <Nav />
      <Hero />
      <PlatformTicker />
      <Problem />
      <Agent />
      <Coverage />
      <Vs />
      <CTA />
      <Footer />
    </div>
  );
}

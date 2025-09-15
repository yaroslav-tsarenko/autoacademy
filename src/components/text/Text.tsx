import React from "react";

export type TermsSection = {
    title?: string;
    paragraphs?: string[];
    bullets?: string[];
};

interface TextProps {
    sections: TermsSection[];
}

const Text: React.FC<TextProps> = ({ sections }) => (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem", fontFamily: "inherit" }}>
        {sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: "2rem" }}>
                {section.title && (
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1976d2" }}>
                        {section.title}
                    </h2>
                )}
                {section.paragraphs?.map((p, i) => (
                    <p key={i} style={{ marginBottom: "0.75rem", lineHeight: 1.7 }}>
                        {p}
                    </p>
                ))}
                {section.bullets && (
                    <ul style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem" }}>
                        {section.bullets.map((b, j) => (
                            <li key={j} style={{ marginBottom: "0.5rem" }}>{b}</li>
                        ))}
                    </ul>
                )}
            </div>
        ))}
    </div>
);

export default Text;
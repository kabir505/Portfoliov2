import React, { useEffect, useState, useCallback } from "react";
import { Instagram, Linkedin, Music2, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const SocialCard = ({ icon: Icon, title, subtitle, href, gradient, children, showHeader = true, minimal = false }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={
            minimal
                ? "group relative flex flex-col"
                : "group relative flex flex-col justify-between rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
        }
    >
        {!minimal && (
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${gradient}`} />
        )}
        {showHeader && (
            <div className="relative p-5 sm:p-6 flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-white/10">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <div className="text-white font-semibold truncate">{title}</div>
                    {subtitle && (
                        <div className="text-sm text-gray-400 truncate">{subtitle}</div>
                    )}
                </div>
                <ExternalLink className="ml-auto w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
        )}
        {children}
    </a>
);

const loadScriptOnce = (src) => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
};

const OEmbed = ({ provider, url, className }) => {
    const [html, setHtml] = useState("");

    const fetchOEmbed = useCallback(async () => {
        try {
            if (!url) return;
            if (provider === "tiktok") {
                const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
                const data = await res.json();
                setHtml(data.html || "");
                // TikTok provides its own script tag inside html
            } else if (provider === "instagram") {
                // Prefer Graph API oEmbed (requires token), fallback to plain embed.js
                const token = import.meta.env.VITE_IG_OEMBED_TOKEN;
                if (token) {
                    const res = await fetch(
                        `https://graph.facebook.com/v19.0/instagram_oembed?omitscript=true&url=${encodeURIComponent(url)}&access_token=${encodeURIComponent(token)}`
                    );
                    const data = await res.json();
                    setHtml(data.html || "");
                    loadScriptOnce("https://www.instagram.com/embed.js");
                } else {
                    // Fallback: render a basic embed blockquote and load script
                    const embedHtml = `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote>`;
                    setHtml(embedHtml);
                    loadScriptOnce("https://www.instagram.com/embed.js");
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("oEmbed fetch failed", e);
        }
    }, [provider, url]);

    useEffect(() => {
        fetchOEmbed();
    }, [fetchOEmbed]);

    useEffect(() => {
        // Reprocess Instagram embeds when html updates
        if (provider === "instagram" && window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
        }
    }, [html, provider]);

    return (
        <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
    );
};

const SocialMedia = () => {
    useEffect(() => {
        AOS.init({ offset: 10 });
    }, []);

    // TODO: If you want live embeds later, we can fetch oEmbed HTML and render it below each header.

    // Paste your public post/video links below. Keep them public so embeds work.
    const instagramUrls = [
        "https://www.instagram.com/p/DC9MWhiN33O/",
        "https://www.instagram.com/p/C7NEqOiI-19/",
        "https://www.instagram.com/reel/DDMx59uNURI/",
    ];
    const tiktokUrls = [
        "https://www.tiktok.com/@codingkabs/photo/7318129345510329633",
        "https://www.tiktok.com/@codingkabs/video/7548819977428602134",
        "https://www.tiktok.com/@codingkabs/video/7517257109642186006",
    ];

    // Rotate featured embed every few seconds
    const [igIndex, setIgIndex] = useState(0);
    const [ttIndex, setTtIndex] = useState(0);
    // Hover zoom is handled via CSS classes; modal state removed

    useEffect(() => {
        const igTimer = setInterval(() => {
            setIgIndex((i) => (i + 1) % instagramUrls.length);
        }, 8000);
        const ttTimer = setInterval(() => {
            setTtIndex((i) => (i + 1) % tiktokUrls.length);
        }, 9000);
        return () => {
            clearInterval(igTimer);
            clearInterval(ttTimer);
        };
    }, [instagramUrls.length, tiktokUrls.length]);

    return (
        <>
            <div className="px-[5%] sm:px-[5%] lg:px-0 mb-4" data-aos="fade-up" data-aos-duration="800">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] mb-2">Social Media</h2>
                <p className="text-gray-400 mt-1">Follow and connect across platforms.</p>
            </div>

            <div className="w-full bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-8 sm:p-8 transform transition-all duration-500 hover:shadow-[#6366f1]/10" data-aos="fade-up" data-aos-duration="1000">
            <div className="space-y-8">
                {/* Instagram - Large on top */}
                <div data-aos="fade-up">
                    <div>
                        <h4 className="text-white text-2xl font-semibold mb-3 text-center px-5">Instagram</h4>
                        <SocialCard
                            icon={Instagram}
                            title="Instagram"
                            subtitle="@codingkabs • <span class='text-gray-400'>followers</span>"
                            href="https://www.instagram.com/codingkabs"
                        gradient="from-[#833AB4] via-[#E4405F] to-[#FCAF45]"
                        showHeader={false}
                        minimal
                        >
                            <div className="px-5 pb-5">
                            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 shadow-lg group-hover:shadow-[#6366f1]/20 transition-all h-[240px] flex items-center justify-center">
                                    <img src="/instagrampage.png" alt="Instagram screenshot" className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"/>
                                </div>
                            </div>
                        </SocialCard>
                    </div>
                </div>

                {/* TikTok (middle) */}
                <div className="grid grid-cols-1 gap-6" data-aos="fade-up">
                    <div>
                        <h4 className="text-white text-2xl font-semibold mb-3 text-center px-5">TikTok</h4>
                        <SocialCard
                            icon={Music2}
                            title="TikTok"
                            subtitle="@codingkabs • <span class='text-gray-400'>followers</span>"
                            href="https://www.tiktok.com/@codingkabs"
                            gradient="from-[#000000] via-[#25F4EE] to-[#FE2C55]"
                            showHeader={false}
                            minimal
                        >
                            <div className="px-5 pb-5">
                                <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 shadow-lg group-hover:shadow-[#6366f1]/20 transition-all h-[240px] flex items-center justify-center">
                                    <img src="/tiktokpage%20.png" alt="TikTok screenshot" className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"/>
                                </div>
                            </div>
                        </SocialCard>
                    </div>
                </div>

                {/* LinkedIn (bottom) */}
                <div className="grid grid-cols-1 gap-6" data-aos="fade-up">
                    <div>
                        <h4 className="text-white text-2xl font-semibold mb-3 text-center px-5">LinkedIn</h4>
                        <SocialCard
                            icon={Linkedin}
                            title="LinkedIn"
                            subtitle="kabir-suri-211b1b243 • <span class='text-gray-400'>connections</span>"
                            href="https://www.linkedin.com/in/kabir-suri-211b1b243/"
                            gradient="from-[#0A66C2] to-[#0077B5]"
                            showHeader={false}
                            minimal
                        >
                            <div className="px-5 pb-5">
                                <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 shadow-lg group-hover:shadow-[#6366f1]/20 transition-all h-[240px] flex items-center justify-center">
                                    <img src="/linkedinpage.png" alt="LinkedIn screenshot" className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"/>
                                </div>
                            </div>
                        </SocialCard>
                    </div>
                </div>
            </div>
            
        </div>
        </>
    );
};

export default SocialMedia;



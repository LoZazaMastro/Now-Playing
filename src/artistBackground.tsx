import { DialogButton, Focusable } from "@decky/ui";
import { toaster } from "@decky/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaCheck, FaCog, FaDownload, FaImage, FaSyncAlt } from "react-icons/fa";
import * as python from "./python";
import type { ArtistBackgroundCandidate } from "./python";
import { getTranslations, localizeRuntimeMessage } from "./i18n";

export function ArtistBackgroundPicker({
  provider,
  artistId,
  artistName,
  onBack,
  onApplied,
}: {
  provider: "local" | "spotify";
  artistId: string;
  artistName: string;
  onBack: () => void;
  onApplied: (url: string) => void;
}) {
  const t = useMemo(() => getTranslations("core"), []);
  const [items, setItems] = useState<ArtistBackgroundCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState("");
  const [error, setError] = useState("");
  const [failedPreviews, setFailedPreviews] = useState<Record<string, boolean>>({});
  const [loadedPreviews, setLoadedPreviews] = useState<Record<string, string>>({});
  const searchRevisionRef = useRef(0);
  const accent = provider === "spotify" ? "#1DB954" : "#D9A337";

  const search = useCallback(async () => {
    const revision = ++searchRevisionRef.current;
    setLoading(true);
    setError("");
    setFailedPreviews({});
    setLoadedPreviews({});
    void python.reportDiagnosticEvent("artwork", "search_started", { provider, artistId, artistName }).catch(() => {});
    let timeoutId = 0;
    try {
      const result = await Promise.race([
        python.searchArtistBackgrounds(provider, artistId, artistName, "all"),
        new Promise<never>((_, reject) => {
          timeoutId = window.setTimeout(() => reject(new Error(t.backgroundSearchTimedOut)), 16000);
        }),
      ]);
      if (revision !== searchRevisionRef.current) return;
      if (!result.ok) throw new Error(result.error || t.backgroundApplyFailed);
      const nextItems = Array.isArray(result.data?.items) ? result.data!.items : [];
      setItems(nextItems);
      void python.reportDiagnosticEvent("artwork", "search_completed", { provider, artistId, artistName, count: nextItems.length }).catch(() => {});
    } catch (reason: any) {
      if (revision !== searchRevisionRef.current) return;
      setItems([]);
      const message = localizeRuntimeMessage(reason?.message ?? String(reason), t.backgroundApplyFailed);
      setError(message);
      void python.reportDiagnosticEvent("artwork", "search_failed", { provider, artistId, artistName, error: message }).catch(() => {});
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (revision === searchRevisionRef.current) setLoading(false);
    }
  }, [artistId, artistName, provider, t.backgroundApplyFailed, t.backgroundSearchTimedOut]);

  useEffect(() => {
    void search();
    return () => { searchRevisionRef.current += 1; };
  }, [search]);

  useEffect(() => {
    let disposed = false;
    const objectUrls: string[] = [];
    const controllers: AbortController[] = [];
    const queue = items.filter((candidate) => Boolean(candidate.previewUrl));
    let cursor = 0;
    const worker = async () => {
      while (!disposed) {
        const candidate = queue[cursor++];
        if (!candidate) return;
        const controller = new AbortController();
        controllers.push(controller);
        const timer = window.setTimeout(() => controller.abort(), 12000);
        try {
          const response = await fetch(candidate.previewUrl, { cache: "force-cache", signal: controller.signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          if (!blob.type.startsWith("image/") || blob.size < 256) throw new Error("Invalid image preview");
          const objectUrl = URL.createObjectURL(blob);
          objectUrls.push(objectUrl);
          if (!disposed) setLoadedPreviews((current) => ({ ...current, [candidate.id]: objectUrl }));
        } catch {
          if (!disposed) setFailedPreviews((current) => ({ ...current, [candidate.id]: true }));
        } finally {
          window.clearTimeout(timer);
        }
      }
    };
    void Promise.all([worker(), worker()]);
    return () => {
      disposed = true;
      controllers.forEach((controller) => controller.abort());
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  async function apply(candidate: ArtistBackgroundCandidate) {
    if (applyingId) return;
    setApplyingId(candidate.id);
    setError("");
    void python.reportDiagnosticEvent("artwork", "apply_started", { provider, artistId, artistName, candidateId: candidate.id, source: candidate.source }).catch(() => {});
    try {
      const result = await python.applyArtistBackground(provider, artistId, artistName, candidate.id);
      if (!result.ok || !result.url) throw new Error(result.error || t.backgroundApplyFailed);
      setItems((current) => current.map((item) => ({ ...item, selected: item.id === candidate.id })));
      onApplied(result.url);
      toaster.toast({ title: artistName, body: t.backgroundApplied, duration: 2600 });
      void python.reportDiagnosticEvent("artwork", "apply_completed", { provider, artistId, artistName, candidateId: candidate.id, source: candidate.source }).catch(() => {});
    } catch (reason: any) {
      const message = localizeRuntimeMessage(reason?.message ?? String(reason), t.backgroundApplyFailed);
      setError(message);
      toaster.toast({ title: artistName, body: message, duration: 3600 });
      void python.reportDiagnosticEvent("artwork", "apply_failed", { provider, artistId, artistName, candidateId: candidate.id, source: candidate.source, error: message }).catch(() => {});
    } finally {
      setApplyingId("");
    }
  }

  return (
    <Focusable flow-children="vertical" style={{ width: "100%" }}>
      <DialogButton
        style={{ width: 112, minWidth: 112, height: 38, padding: 0, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.035)" }}
        onClick={onBack}
      >
        <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><FaArrowLeft size={12} /> {t.back}</span>
      </DialogButton>

      <div style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: .58, textTransform: "uppercase", letterSpacing: ".12em", fontSize: 12, fontWeight: 700 }}><FaCog /> {t.artistBackgroundSettings}</div>
        <h1 style={{ margin: "10px 0 0", fontSize: "clamp(44px,5vw,72px)", lineHeight: 1.02, letterSpacing: "-.045em", fontWeight: 610 }}>{artistName}</h1>
        <p style={{ maxWidth: 920, margin: "14px 0 0", fontSize: 18, lineHeight: 1.5, opacity: .62 }}>{t.artistBackgroundDescription}</p>
      </div>



      {loading ? (
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 10, fontSize: 19, opacity: .65 }}><FaSyncAlt className="npArtistBackgroundSpin" /> {t.searchingBackgrounds}</div>
      ) : null}

      {!loading && items.length ? (
        <Focusable flow-children="grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 18, marginTop: 32 }}>
          {items.map((candidate) => {
            const applying = applyingId === candidate.id;
            return (
              <DialogButton
                key={candidate.id}
                className={`npArtistBackgroundCandidate${candidate.selected ? " npArtistBackgroundCandidateSelected" : ""}`}
                disabled={Boolean(applyingId)}
                onClick={() => void apply(candidate)}
                style={{
                  position: "relative",
                  width: "100%",
                  minWidth: 0,
                  height: "auto",
                  minHeight: 0,
                  padding: 0,
                  overflow: "hidden",
                  borderRadius: 14,
                  border: candidate.selected ? `2px solid ${accent}` : "1px solid rgba(255,255,255,.10)",
                  background: candidate.selected ? `linear-gradient(145deg, ${accent}22, rgba(255,255,255,.035))` : "rgba(255,255,255,.045)",
                  boxShadow: candidate.selected ? `0 0 0 1px ${accent}55, 0 0 30px ${accent}55, 0 18px 50px rgba(0,0,0,.34)` : "none",
                }}
              >
                <span style={{ width: "100%", display: "block", textAlign: "left" }}>
                  <span style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "rgba(255,255,255,.055)" }}>
                    <span style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: loadedPreviews[candidate.id] ? 0 : .42, transition: "opacity .16s ease" }}>
                      <FaImage size={42} />
                      <span style={{ fontSize: 12 }}>{candidate.source}</span>
                    </span>
                    {loadedPreviews[candidate.id] && !failedPreviews[candidate.id] ? (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "block",
                          backgroundImage: `url(${JSON.stringify(loadedPreviews[candidate.id])})`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                        }}
                      />
                    ) : null}
                    {candidate.selected ? <span style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.72)", color: "#fff" }}><FaCheck size={13} /></span> : null}
                    {applying ? <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "rgba(0,0,0,.72)", color: "#fff", fontSize: 16 }}><FaDownload className="npArtistBackgroundPulse" /> {t.downloadingBackground}</span> : null}
                  </span>
                  <span style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", gap: 12, padding: "12px 14px 13px" }}>
                    <span style={{ minWidth: 0 }}>
                      <strong style={{ display: "block", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{candidate.source}</strong>
                      <span style={{ display: "block", marginTop: 4, fontSize: 13, opacity: .58 }}>{t.resolution}: {candidate.width} × {candidate.height}</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, opacity: .74 }}><FaDownload size={12} /> {candidate.selected ? t.currentBackground : t.downloadAndApply}</span>
                  </span>
                </span>
              </DialogButton>
            );
          })}
        </Focusable>
      ) : null}

      {!loading && !items.length ? <div style={{ marginTop: 32, padding: 24, borderRadius: 14, background: "rgba(255,255,255,.04)", fontSize: 19, opacity: .62 }}>{error || t.noBackgroundsFound}</div> : null}
      {error && items.length ? <div style={{ marginTop: 18, color: "#ff9a9a", fontSize: 16 }}>{error}</div> : null}

      <DialogButton style={{ width: 190, minWidth: 190, height: 44, marginTop: 24 }} disabled={loading || Boolean(applyingId)} onClick={() => void search()}>
        <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FaSyncAlt /> {t.refreshBackgrounds}</span>
      </DialogButton>

      <style>{`
        @keyframes npArtistBackgroundSpin { to { transform: rotate(360deg); } }
        @keyframes npArtistBackgroundPulse { from { opacity:.5; transform:scale(.94); } to { opacity:1; transform:scale(1.05); } }
        .npArtistBackgroundSpin { animation: npArtistBackgroundSpin .85s linear infinite; }
        .npArtistBackgroundPulse { animation: npArtistBackgroundPulse .7s ease-in-out infinite alternate; }
        .npArtistBackgroundCandidate, .npArtistBackgroundCandidate * { color:#fff!important; }
        .npArtistBackgroundCandidate:hover, .npArtistBackgroundCandidate:focus, .npArtistBackgroundCandidate.gpfocus { color:#fff!important; border-color:${accent}!important; box-shadow:0 0 0 1px ${accent}55,0 0 26px ${accent}44,0 18px 50px rgba(0,0,0,.34)!important; }
        .npArtistBackgroundCandidateSelected:hover, .npArtistBackgroundCandidateSelected:focus, .npArtistBackgroundCandidateSelected.gpfocus { box-shadow:0 0 0 1px ${accent}88,0 0 38px ${accent}77,0 18px 50px rgba(0,0,0,.38)!important; }
      `}</style>
    </Focusable>
  );
}

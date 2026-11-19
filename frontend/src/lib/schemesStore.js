import { useCallback, useEffect, useState } from "react";

const LANG_KEY = "becci-scheme-lang";
const LANG_EVENT = "becci-scheme-lang-change";

function readSavedLang() {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    return saved === "te" ? "te" : "en";
  } catch {
    return "en";
  }
}

export function useSchemeLanguage() {
  const [lang, setLangState] = useState(readSavedLang);

  const setLang = useCallback((next) => {
    const val = next === "te" ? "te" : "en";
    setLangState(val);
    try {
      window.localStorage.setItem(LANG_KEY, val);
    } catch {
      // ignore storage quota / privacy mode errors
    }
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: val }));
  }, []);

  useEffect(() => {
    const onChange = (e) => {
      if (e?.detail === "te" || e?.detail === "en") setLangState(e.detail);
    };
    window.addEventListener(LANG_EVENT, onChange);
    return () => window.removeEventListener(LANG_EVENT, onChange);
  }, []);

  return [lang, setLang];
}

let indexCache = null;
let indexPromise = null;
const detailCache = new Map();
const detailPromises = new Map();

export function getCachedSchemesSync() {
  return indexCache;
}

export async function loadSchemesIndex() {
  if (indexCache) return indexCache;
  if (!indexPromise) {
    indexPromise = fetch("/data/schemes-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load schemes index (${res.status})`);
        return res.json();
      })
      .then((data) => {
        indexCache = Array.isArray(data) ? data : [];
        return indexCache;
      })
      .catch((err) => {
        indexPromise = null;
        throw err;
      });
  }
  return indexPromise;
}

export async function loadSchemeDetail(slug) {
  if (!slug) return null;
  if (detailCache.has(slug)) return detailCache.get(slug);
  if (!detailPromises.has(slug)) {
    const p = fetch(`/data/schemes/${encodeURIComponent(slug)}.json`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Failed to load scheme details (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (data) detailCache.set(slug, data);
        detailPromises.delete(slug);
        return data;
      })
      .catch((err) => {
        detailPromises.delete(slug);
        throw err;
      });
    detailPromises.set(slug, p);
  }
  return detailPromises.get(slug);
}

export function useSchemesIndex() {
  const [schemes, setSchemes] = useState(() => indexCache || []);
  const [loading, setLoading] = useState(() => !indexCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (indexCache) {
      setSchemes(indexCache);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    loadSchemesIndex()
      .then((data) => {
        if (!active) return;
        setSchemes(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load verified schemes catalog.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { schemes, loading, error };
}

export function useSchemeDetail(slug) {
  const [scheme, setScheme] = useState(() => (slug && detailCache.has(slug) ? detailCache.get(slug) : null));
  const [loading, setLoading] = useState(() => Boolean(slug && !detailCache.has(slug)));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!slug) {
      setScheme(null);
      setLoading(false);
      return undefined;
    }
    if (detailCache.has(slug)) {
      setScheme(detailCache.get(slug));
      setLoading(false);
      setError(null);
      return undefined;
    }
    setLoading(true);
    setError(null);
    loadSchemeDetail(slug)
      .then((data) => {
        if (!active) return;
        setScheme(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load scheme details.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { scheme, loading, error };
}

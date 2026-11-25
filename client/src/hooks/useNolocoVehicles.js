import { useEffect, useState } from "react";

/**
 * Fetches the full vehicle list from the backend Noloco proxy once
 * and caches it in module scope so re-mounts don't re-fetch.
 */
let _cache = null;
let _inFlight = null;

function fetchVehicles() {
  if (_inFlight) return _inFlight;
  _inFlight = fetch("/api/noloco/vehicles")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      // Backend returns {error} when Noloco auth fails or other upstream errors
      if (data?.error) throw new Error(data.error);
      _cache = data;
      _inFlight = null;
      return data;
    })
    .catch((err) => {
      _inFlight = null;
      throw err;
    });
  return _inFlight;
}

export default function useNolocoVehicles() {
  const [vehicles, setVehicles] = useState(_cache || []);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cache) return; // already loaded
    setLoading(true);
    fetchVehicles()
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { vehicles, loading, error };
}

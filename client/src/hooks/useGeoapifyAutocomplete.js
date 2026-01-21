import { useEffect, useState } from "react";

const GEOAPIFY_FALLBACK_KEY = "2368b0b3563c4fba87149a0cb1d8270b";

function useGeoapifyAutocomplete(initialValue = "") {
  const [address, setAddress] = useState(initialValue);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isAddressSearching, setIsAddressSearching] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  useEffect(() => {
    const query = address.trim();
    const apiKey =
      process.env.REACT_APP_GEOAPIFY_API_KEY || GEOAPIFY_FALLBACK_KEY;

    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setIsAddressSearching(false);
      setShowAddressSuggestions(false);
      return undefined;
    }

    let isCurrent = true;
    const controller = new AbortController();

    setIsAddressSearching(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&apiKey=${apiKey}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Address lookup failed");

        const data = await res.json();
        if (!isCurrent) return;

        const suggestions = (data.features || []).map((feature, index) => {
          const props = feature.properties || {};
          const secondaryFallback = [
            props.city,
            props.state_code || props.state,
            props.postcode,
            props.country,
          ]
            .filter(Boolean)
            .join(", ");

          return {
            id: props.place_id || `${props.formatted || ""}-${index}`,
            primary: props.address_line1 || props.formatted || "",
            secondary: props.address_line2 || secondaryFallback,
            formatted: props.formatted || props.address_line1 || "",
          };
        });

        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(suggestions.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
        if (isCurrent) {
          setAddressSuggestions([]);
          setShowAddressSuggestions(false);
        }
      } finally {
        if (isCurrent) {
          setIsAddressSearching(false);
        }
      }
    }, 350);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [address]);

  return {
    address,
    setAddress,
    addressSuggestions,
    setAddressSuggestions,
    isAddressSearching,
    showAddressSuggestions,
    setShowAddressSuggestions,
  };
}

export default useGeoapifyAutocomplete;

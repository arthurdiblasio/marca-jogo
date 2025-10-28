// src/hooks/useGooglePlaces.ts
import { useState, useCallback } from "react";
import { showToast } from "@/hooks/useToast";

interface Prediction {
  description: string;
  place_id: string;
}

export const useGooglePlaces = (initialAddress = "") => {
  const [address, setAddress] = useState(initialAddress);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Busca detalhes (lat/lng) por Place ID
  const fetchAddressDetails = useCallback(async (placeId: string) => {
    try {
      const response = await fetch(
        `/api/google-places/details?placeId=${placeId}`
      );
      const data = await response.json();
      if (response.ok) {
        const location = data.result.geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
      } else {
        showToast("Erro ao buscar detalhes do endereço", "error");
      }
    } catch (error) {
      showToast("Erro ao buscar detalhes do endereço", "error");
    }
  }, []);

  // Busca sugestões de endereço
  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/google-places?input=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      }
    } catch (error) {
      showToast("Erro ao buscar sugestões de endereço", "error");
    }
  }, []);

  // Handler para quando uma sugestão é selecionada
  const handleSelectSuggestion = useCallback(
    (s: Prediction) => {
      setAddress(s.description);
      setSuggestions([]);
      setShowSuggestions(false);
      fetchAddressDetails(s.place_id);
    },
    [fetchAddressDetails]
  );

  // Handler para a mudança do input de endereço
  const handleAddressChange = useCallback(
    (input: string) => {
      setAddress(input);
      fetchSuggestions(input);
    },
    [fetchSuggestions]
  );

  // Reseta todos os estados de localização
  const resetLocation = useCallback(() => {
    setAddress("");
    setLatitude(null);
    setLongitude(null);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  return {
    address,
    latitude,
    longitude,
    suggestions,
    showSuggestions,
    setAddress,
    setShowSuggestions,
    handleAddressChange,
    handleSelectSuggestion,
    resetLocation,
  };
};

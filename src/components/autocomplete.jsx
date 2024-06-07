import { useCallback, useEffect } from "react";
import { useState } from "react";
import "./styles.css";
import SuggestionsList from "./suggestions-list";
import debounce from "lodash/debounce";

const AutoComplete = ({
  placeholder = "",
  staticData,
  fetchSuggestions,
  dataKey = "",
  customLoading = "Loading...",
  onSelect = () => {},
  onChange = () => {},
  onBlur = () => {},
  onFocus = () => {},
  customStyles = {},
}) => {
  const [inputValue, setinputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  console.log(suggestions);
  const handleInputChange = (event) => {
    setinputValue(event.target.value);
    onChange(event.target.value);
  };

  const getSuggestions = async (query) => {
    setError(null);
    setloading(true);
    try {
      let result;
      if (staticData) {
        result = staticData.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase());
        });
      } else if (fetchSuggestions) {
        result = await fetchSuggestions(query);
      }
      setSuggestions(result);
    } catch (error) {
      setError("Failed to fetch suggestions");
      setSuggestions([]);
    } finally {
      setloading(false);
    }
  };

  const getSuggestionsDebounced = useCallback(
    debounce(getSuggestions, 300),
    []
  );

  const handleSuggestionClick = (suggestion) => {
    setinputValue(dataKey ? suggestion[dataKey] : dataKey);
    onSelect(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestionsDebounced(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);
  console.log("suggestions", suggestions);
  return (
    <div className="container">
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        style={customStyles}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleInputChange}
      />

      {(suggestions.length > 0 || loading || error) && (
        <ul className="suggestions-list">
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading">{customLoading}</div>}
          <SuggestionsList
            dataKey={dataKey}
            highlight={inputValue}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </ul>
      )}
    </div>
  );
};
export default AutoComplete;

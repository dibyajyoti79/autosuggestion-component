import React from "react";

const SuggestionsList = ({
  suggestions = [],
  highlight,
  dataKey,
  onSuggestionClick,
}) => {
  const getHighlightedText = (text, highlight) => {
    console.log("text", text);
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) => {
          return part.toLowerCase() === highlight.toLowerCase() ? (
            <b key={index} style={{ color: "blue" }}>
              {part}
            </b>
          ) : (
            part
          );
        })}
      </span>
    );
  };

  return (
    <React.Fragment>
      {suggestions.map((suggestion, index) => {
        const currentSuggestion = dataKey ? suggestion[dataKey] : suggestion;
        return (
          <li
            key={index}
            onClick={() => {
              onSuggestionClick(suggestion);
            }}
            className="suggestion-item"
          >
            {getHighlightedText(currentSuggestion, highlight)}
          </li>
        );
      })}
    </React.Fragment>
  );
};
export default SuggestionsList;

import React from 'react';
import './TagSelector.css';

const TagSelector = ({
  label,
  value,
  onChange,
  options = [],
  multiple = true,
  required = false
}) => {
  // Parse selected tags
  const selectedTags = value ? value.split(',').map(t => t.trim()).filter(t => t) : [];

  const handleTagClick = (tag) => {
    if (multiple) {
      // Multiple selection mode
      let newTags;
      if (selectedTags.includes(tag)) {
        // Remove tag
        newTags = selectedTags.filter(t => t !== tag);
      } else {
        // Add tag
        newTags = [...selectedTags, tag];
      }
      onChange({ target: { value: newTags.join(',') } });
    } else {
      // Single selection mode
      if (selectedTags.includes(tag)) {
        // Deselect
        onChange({ target: { value: '' } });
      } else {
        // Select this tag only
        onChange({ target: { value: tag } });
      }
    }
  };

  return (
    <div className="tag-selector-container">
      {label && (
        <label className="tag-selector-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="tag-selector-hint">
        {multiple ? 'Click to select multiple tags' : 'Click to select one tag'}
      </div>
      <div className="tag-selector-options">
        {options.length === 0 ? (
          <p className="no-options">No options available</p>
        ) : (
          options.map((option) => {
            const isSelected = selectedTags.includes(option);
            return (
              <button
                key={option}
                type="button"
                className={`tag-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTagClick(option)}
              >
                {isSelected && <span className="checkmark">✓</span>}
                {option}
              </button>
            );
          })
        )}
      </div>
      {selectedTags.length > 0 && (
        <div className="selected-tags-display">
          <strong>Selected:</strong> {selectedTags.join(', ')}
        </div>
      )}
    </div>
  );
};

export default TagSelector;

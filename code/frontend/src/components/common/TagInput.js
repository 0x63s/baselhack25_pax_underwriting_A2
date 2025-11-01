import React, { useState } from 'react';
import './TagInput.css';

const TagInput = ({ label, value, onChange, placeholder, required = false }) => {
  const [inputValue, setInputValue] = useState('');

  // Parse existing tags from comma-separated string
  const tags = value ? value.split(',').map(t => t.trim()).filter(t => t) : [];

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      onChange({ target: { value: newTags.join(',') } });
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange({ target: { value: newTags.join(',') } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === ',' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue.trim());
    }
  };

  return (
    <div className="tag-input-container">
      {label && (
        <label className="tag-input-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="tag-input-wrapper">
        <div className="tags-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="tag-input-field"
          />
        </div>
      </div>
      <div className="tag-input-hint">
        Press Enter or comma to add tags. Click × to remove.
      </div>
    </div>
  );
};

export default TagInput;

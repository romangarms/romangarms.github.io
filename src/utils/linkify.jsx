import React from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export function linkifyText(text) {
  if (!text) return text;

  const parts = text.split(URL_REGEX);

  return parts.map((part, index) => {
    if (URL_REGEX.test(part)) {
      URL_REGEX.lastIndex = 0;
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

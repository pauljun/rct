import React from 'react';
export default function({ ...props }) {
  console.error('load component error', props);
  return <span className="load-error" />;
}

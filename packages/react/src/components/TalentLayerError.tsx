import React from 'react';

interface TalentLayerErrorProps {
  error: any;
}

export default function TalentLayerError(props: TalentLayerErrorProps) {
  const { error } = props;

  return (
    <div style={{ zIndex: Infinity, background: '#000000', color: '#ffffff' }}>
      <h1>TalentLayer Error</h1>
      {(() => {
        try {
          return JSON.stringify(error, null, 4);
        } catch {
          return `Error : ${error}`;
        }
      })()}
    </div>
  );
}

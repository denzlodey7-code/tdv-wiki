'use client';

import React, { useState } from 'react';
import { SelectElementFAB, ElementDialog, RU_LOCALE } from '@zai/select-element';
import type { SelectedElement } from '@zai/select-element';

export default function ClientSelectElementWrapper() {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);

  return (
    <>
      <SelectElementFAB
        onElementSelect={(el) => setSelectedElement(el)}
        draggable={true}
      />
      {selectedElement && (
        <ElementDialog
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}
    </>
  );
}

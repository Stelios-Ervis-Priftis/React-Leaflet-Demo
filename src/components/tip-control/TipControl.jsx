import { useState } from 'react';

import { RiCloseCircleLine } from 'react-icons/all';
import './tipcontol.scss';

export default function TipControl() {
  const handleIsPanelClose = () => {
    setIsPanelClose(true);
  };

  return (
    <div className={'tip-control'}>
      <p>
        To activate <span>Scroll Wheel Zoom</span> functionality press and hold <span>W</span> Key on your
        Keyboard
      </p>
      <RiCloseCircleLine className="close-btn" onClick={handleIsPanelClose} />
    </div>
  );
}

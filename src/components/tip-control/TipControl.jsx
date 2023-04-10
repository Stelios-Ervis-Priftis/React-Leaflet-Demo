import { useState } from 'react';

import { RiCloseCircleLine } from 'react-icons/all';
import './tipcontol.scss';

export default function TipControl(props) {
  const { scrollWheelZoom } = props;
  const [isPanelClose, setIsPanelClose] = useState(false);

  const handleIsPanelClose = () => {
    console.log('clicked');
    setIsPanelClose(true);
  };

  return (
    <div className={`tip-control ${isPanelClose || scrollWheelZoom ? 'hide' : ''}`}>
      <p>
        To activate <span>Scroll Wheel Zoom</span> functionality press and hold <span>W</span> Key on your
        Keyboard
      </p>
      <RiCloseCircleLine className="close-btn" onClick={handleIsPanelClose} />
    </div>
  );
}

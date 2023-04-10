import { TbZoomOutArea } from 'react-icons/all';
import './resetMapControl.scss';

export default function ResetMapControl({ handleMapReset }) {
  return (
    <div className={`reset-tip-control`}>
      <p>
        <span>Tip:</span> Click the icon to Reset the map and see all countries again
      </p>
      <TbZoomOutArea className="reset-icon" onClick={handleMapReset} />
    </div>
  );
}

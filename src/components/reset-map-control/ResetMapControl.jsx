import { TbZoomOutArea } from 'react-icons/all';
import './resetMapControl.scss';

const tools = [
  {
    name: 'magnifier-reset-control',
    text: 'Tip: Click the icon to Reset the map and see all countries again',
    icon: <TbZoomOutArea className="reset-icon" />,
  },
];

export default function ResetMapControl({ handleMapReset }) {
  return tools.map((tool, i) => {
    console.log(Object.keys(tools[i]));
    return (
      <div key={i}>
        <div className={tool.name}>
          <div>{tool.text}</div>

          <div>{tool.icon}</div>
        </div>
      </div>
    );
  });
}

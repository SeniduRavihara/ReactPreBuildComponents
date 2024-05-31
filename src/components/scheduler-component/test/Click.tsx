import { useState } from "react";
import "./style.css";

const ClickableBox = () => {
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e) => {
    // Get the position of the click relative to the box
    const { offsetX, offsetY } = e.nativeEvent;
    setClickPosition({ x: offsetX, y: offsetY });
  };

  return (
    <div className="container">
      <div className="box" onClick={handleClick}>
        Click inside the box
      </div>
      <div className="click-position">
        Clicked position: ({clickPosition.x}, {clickPosition.y})
      </div>
    </div>
  );
};

export default ClickableBox;

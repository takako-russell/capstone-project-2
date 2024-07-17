import React from "react";
import { Calendar, theme } from "antd";

const Calender = () => {
  const { token } = theme.useToken();
  const wrapperStyle = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} />
    </div>
  );
};
export default Calender;

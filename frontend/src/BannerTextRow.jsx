import React from "react";
import { Row, Col } from "antd";

const BannerTextRow = ({ location }) => {
  const renderContent = () => {
    if (location.pathname === "/stores") {
      return (
        <Row
          style={{
            position: "relative",
            width: "100%",
            boxShadow: "rgb(78 68 79 / 20%) 1px 10px 20px -5px",
            textShadow: "rgb(220, 220, 220) 4px 2px 10px",
          }}
        >
          <Col
            span={17}
            style={{
              textAlign: "center",
              maxHeight: "120px",
            }}
          >
            <img
              src="/images/spaceFill.png"
              alt="Space Fill"
              style={{ width: "100%", height: "100%" }}
            />

            <Col
              style={{
                position: "absolute",
                textAlign: "center",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "40px",
                fontWeight: "60",
              }}
            >
              Make your shopping easy and fun!
            </Col>
          </Col>
          <Col span={7} style={{ textAlign: "right" }}>
            <img
              src="/images/top-image.png"
              alt="Background"
              style={{ width: "100%", height: "100%", maxHeight: "120px" }}
            />
          </Col>
        </Row>
      );
    } else if (/\/stores\/.*\/items$/.test(location.pathname)) {
      return (
        <Row
          style={{
            width: "100%",
            boxShadow: "rgb(78 68 79 / 20%) 1px 10px 20px -5px",
            textShadow: "rgb(220, 220, 220) 4px 2px 10px",
          }}
        >
          <Col span={24}>
            <img
              src="/images/item-img3.png"
              alt="Background"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "120px",
                objectPosition: "center 30%",
                objectFit: "cover",
              }}
            />
          </Col>
        </Row>
      );
    } else if (location.pathname === "/expense-details") {
      return (
        <Row
          style={{
            position: "relative",
            width: "100%",
            boxShadow: "rgb(78 68 79 / 20%) 1px 10px 20px -5px",
            textShadow: "rgb(220, 220, 220) 4px 2px 10px",
          }}
        >
          <Col span={24}>
            <img
              src="/images/expense-img.png"
              alt="Background"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "120px",
                objectPosition: "center 20%",
                objectFit: "cover",
              }}
            />
          </Col>
          <Col
            style={{
              position: "absolute",
              textAlign: "center",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "50px",
              fontWeight: "120px",
              color: "white",
            }}
          >
            Manage your expense
          </Col>
        </Row>
      );
    }
    return null;
  };

  return <Row>{renderContent()}</Row>;
};

export default BannerTextRow;

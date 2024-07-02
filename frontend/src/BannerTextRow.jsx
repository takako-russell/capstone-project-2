import React from "react";
import { Row, Col } from "antd";

const BannerTextRow = ({ location }) => {
  const renderContent = () => {
    if (location.pathname === "/stores") {
      return (
        <Row
          //   shadow={{
          //     shadowColor: "rgba(0, 0, 0, 1)",
          //     shadowOffsetX: "2px",
          //     shadowOffsetY: "2px",
          //     shadowBlur: "4px",
          //   }}
          style={{
            width: "100%",
            boxShadow: "rgb(78 68 79 / 20%) 1px 10px 20px -5px",
            textShadow: "rgb(220, 220, 220) 4px 2px 10px",
          }}
        >
          <Col
            span={12}
            style={{
              position: "relative",
              textAlign: "center",
              maxHeight: "300px",
            }}
          >
            <img
              src="/images/spaceFill.png"
              alt="Space Fill"
              style={{ width: "100%", height: "100%" }}
            />
            <Row>
              <Col
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "40%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "70px",
                  fontWeight: "300",
                }}
              >
                Make shopping
              </Col>
            </Row>
            <Row>
              <Col
                style={{
                  position: "absolute",
                  top: "65%",
                  left: "55%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "70px",
                  fontWeight: "300",
                }}
              >
                Great again
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <img
              src="/images/top-image.png"
              alt="Background"
              style={{ width: "100%", height: "100%", maxHeight: "300px" }}
            />
          </Col>
        </Row>
      );
    } else if (/\/stores\/.*\/items$/.test(location.pathname)) {
      return (
        // <Row
        //   style={{
        //     width: "100%",
        //     textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
        //   }}
        // >
        //   <Col span={10}>
        //     <img src="/images/item-2-img.png" alt="Item 2" />
        //   </Col>
        //   <Col
        //     span={14}
        //     style={{
        //       position: "absolute",
        //       top: "40%",
        //       left: "40%",
        //       transform: "translate(-50%, -50%)",
        //       fontSize: "70px",
        //       fontWeight: "300",
        //     }}
        //   >
        //     <img src="/images/item-1-img.png" alt="Item 1" />
        //   </Col>
        // </Row>
        <Row
          //   shadow={{
          //     shadowColor: "rgba(0, 0, 0, 1)",
          //     shadowOffsetX: "2px",
          //     shadowOffsetY: "2px",
          //     shadowBlur: "4px",
          //   }}
          style={{
            width: "100%",
            boxShadow: "rgb(78 68 79 / 20%) 1px 10px 20px -5px",
            textShadow: "rgb(220, 220, 220) 4px 2px 10px",
          }}
        >
          <Col
            span={10}
            style={{
              position: "relative",
              textAlign: "center",
              maxHeight: "300px",
            }}
          >
            <img
              src="/images/item-2-img.png"
              alt="Space Fill"
              style={{ width: "100%", height: "100%" }}
            />
          </Col>
          <Col span={14} style={{ textAlign: "right" }}>
            <img
              src="/images/item-1-img.png"
              alt="Background"
              style={{ width: "100%", height: "100%", maxHeight: "300px" }}
            />
          </Col>
        </Row>
      );
    }
    return null;
  };

  return <Row>{renderContent()}</Row>;
};

export default BannerTextRow;

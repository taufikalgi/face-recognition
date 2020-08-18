import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  console.log("this is box, ", box.length);
  console.log("this is image url", imageUrl);
  return (
    <div className="center">
      <div className="absolute mt2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {box.map((value, i) => {
          console.log("this is value, ", value);
          return (
            <div
              className="bounding-box"
              style={{
                top: value.topRow,
                right: value.rightCol,
                left: value.leftCol,
                bottom: value.bottomRow,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;

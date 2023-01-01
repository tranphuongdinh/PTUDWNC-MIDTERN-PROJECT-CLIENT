import React from "react";

const HeadingPresentation = (props) => {
  const {
    heading = "This is heading",
    subHeading = "This is sub heading",
    type,
  } = props;
  return (
    <>
      {type === "preview" ? (
        <>
          <p>{heading}</p>
          <p>{subHeading}</p>
        </>
      ) : (
        <>
          <h2>{heading}</h2>
          <h4>{subHeading}</h4>
        </>
      )}
    </>
  );
};

export default HeadingPresentation;

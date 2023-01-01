import React from "react";

const ParagraphPresentation = (props) => {
  const {
    heading = "This is heading",
    paragraph = "This is paragraph",
    type,
  } = props;
  return (
    <>
      {type === "preview" ? (
        <>
          <p>{heading}</p>
          <p>{paragraph}</p>
        </>
      ) : (
        <>
          <h2>{heading}</h2>
          <p>{paragraph}</p>
        </>
      )}
    </>
  );
};

export default ParagraphPresentation;

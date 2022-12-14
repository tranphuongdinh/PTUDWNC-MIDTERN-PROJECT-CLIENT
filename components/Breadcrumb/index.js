import React from "react";
import styles from "./styles.module.scss";

const Breadcrumb = (props) => {
  const { paths } = props;
  return (
    <div className={styles.breadcrumb}>
      {paths.map((path, index) => {
        return (
          <a key={index} href={path.href}>
            {index ? (
              <>&raquo; {path.label}&nbsp;&nbsp;</>
            ) : (
              <>{path.label}&nbsp;&nbsp;</>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default Breadcrumb;

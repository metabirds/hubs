import React from "react";
import PropTypes from "prop-types";
import styles from "./LoadingScreenLayout.scss";
import { Column } from "../layout/Column";

import loadingImg from "../../assets/images/loading-image.png";

export function LoadingScreenLayout({ center, bottom }) {
  return (
    <div className={styles.loadingScreenLayout}>
      <Column center padding gap="lg" className={styles.center}>
        <img src={loadingImg} className="loading-image" alt={"loading-image"} />
        {center}
      </Column>
      {bottom && (
        <Column center className={styles.bottom}>
          {bottom}
        </Column>
      )}
    </div>
  );
}

LoadingScreenLayout.propTypes = {
  center: PropTypes.node,
  bottom: PropTypes.node
};

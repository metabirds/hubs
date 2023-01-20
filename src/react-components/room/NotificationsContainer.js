import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./NotificationsContainer.scss";
import checkIsMobile from "../../utils/is-mobile";

const isMobile = checkIsMobile();

export function NotificationsContainer({ className, children, ...rest }) {
  return (
    <div className={classNames(className, styles.content, isMobile && styles.mobile)} {...rest}>
      {children}
    </div>
  );
}

NotificationsContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

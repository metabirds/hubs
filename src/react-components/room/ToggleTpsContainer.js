import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ReactComponent as EyeIcon } from "../icons/Eye.svg";
import { ToolbarButton } from "../input/ToolbarButton";
import { FormattedMessage } from "react-intl";

export function ToggleTpsContainer({ scene, isTPS, toggleTPS }) {
  const buttonRef = useRef();

  return (
    <ToolbarButton
      ref={buttonRef}
      icon={<EyeIcon />}
      label={<FormattedMessage id="third-person-button-container.label" defaultMessage="Third Person" />}
      preset="basic"
      onClick={toggleTPS}
    />
  );
}

ToggleTpsContainer.propTypes = {
  scene: PropTypes.object.isRequired,
  isTPS: PropTypes.bool,
  toggleTPS: PropTypes.func
};

import React, { useRef } from "react";
import PropTypes from "prop-types";
import { ReactComponent as EyeIcon } from "../icons/Eye.svg";
import { ToolbarButton } from "../input/ToolbarButton";
import { FormattedMessage } from "react-intl";
import { ToolTip } from "@mozilla/lilypad-ui";
import { useIntl } from "react-intl";

export function ToggleTpsContainer({ toggleTPS }) {
  const buttonRef = useRef();

  const intl = useIntl();

  const description = intl.formatMessage({
    id: "toggleTPS.description",
    defaultMessage: "Switch between first-person and third-person perspectives."
  });

  return (
    <ToolTip description={description}>
      <ToolbarButton
        ref={buttonRef}
        icon={<EyeIcon />}
        label={<FormattedMessage id="third-person-button-container.label" defaultMessage="Third Person" />}
        preset="basic"
        onClick={toggleTPS}
        className="toggleTPSButton"
      />
    </ToolTip>
  );
}

ToggleTpsContainer.propTypes = {
  scene: PropTypes.object.isRequired,
  isTPS: PropTypes.bool,
  toggleTPS: PropTypes.func
};

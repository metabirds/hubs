import React, { useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import { ToolbarButton } from "../input/ToolbarButton";
import { useVolumeMeter } from "../misc/useVolumeMeter";

const micButtonMessages = defineMessages({
  label: {
    id: "voice-button-container.label",
    defaultMessage: "Voice"
  },
  title: {
    id: "voice-button-container.title",
    defaultMessage: "Voice Chat Off"
  }
});

export function ToolbarMicButton({ scene, disabled, ...rest }) {
  const ref = useRef();
  const setRef = node => {
    if (node) {
      ref.current = node.querySelector("rect");
    }
  };
  const update = useCallback(level => {
    const rect = ref.current;
    if (rect) {
      if (level <= 0.1) {
        rect.setAttribute("height", 0);
      } else if (level < 0.3) {
        rect.setAttribute("y", 8);
        rect.setAttribute("height", 4);
      } else {
        rect.setAttribute("y", 4);
        rect.setAttribute("height", 8);
      }
    }
  }, []);
  useVolumeMeter({
    analyser: scene.systems["hubs-systems"].audioSystem.outboundAnalyser,
    update: !disabled && update
  });
  const intl = useIntl();
  return (
    <ToolbarButton
      ref={setRef}
      label={intl.formatMessage(micButtonMessages["label"])}
      preset="basic"
      type={"right"}
      title={disabled ? intl.formatMessage(micButtonMessages["title"]) : undefined}
      disabled={disabled}
      className="leftPos"
      toolbarDescription={
        <FormattedMessage
          id="toolbar-description.mute-button"
          defaultMessage="マイクの有効/ミュート状態を切り替えます"
        />
      }
      {...rest}
    />
  );
}

ToolbarMicButton.propTypes = {
  scene: PropTypes.object.isRequired,
  disabled: PropTypes.bool
};

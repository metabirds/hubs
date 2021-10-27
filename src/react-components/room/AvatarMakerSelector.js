import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CloseButton } from "../input/CloseButton";

export function AvatarMakerSelector(props) {
  const { onSubmit, height, width } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleEvent(event) {
      const { data } = event;
      if (typeof data === "string" || data instanceof String) {
        window.localStorage.setItem('avatarUrl', event.data);
        onSubmit(event.data);
        setOpen(false);
      }
    }
    window.addEventListener("message", handleEvent);
    return () => {
      window.removeEventListener("message", handleEvent);
    };
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const iframeStyle = {
    width: "100%",
    height: "100%",
    border: "1px solid #777"
  };
  const iframeWrapStyle = {
    width: width || "90vw",
    height: height || "80vh",
    position: "fixed",
    top: "50%",
    left: "50%",
    "-webkit-transform": "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
    "z-index": "1000"
  }
  const CloseButtonStyle = {
    position: "absolute",
    top: "10px",
    left: "10px"
  }

  return (
    <div>
      <div>
        <input
          className="Button__button__2C3ps TextInput__button__1ue_9 Button__primary__emMw- Button__lg__-zn8l"
          type="button"
          value="オリジナルのくるまをつくる"
          onClick={handleOpen}
          style={{ margin: "0 auto" }}
        />
      </div>
      {open && (
        <div className="iframeWrap" style={iframeWrapStyle}>
          <CloseButton onClick={handleClose} style={CloseButtonStyle} />
          <iframe
            title="readyplayerme"
            id="readyplayerme_iframe"
            frameborder="0"
            src="https://avatar-maker.vrwakuworld.com/"
            className=""
            allow="camera *; microphone *"
            style={iframeStyle}
          />
        </div>
      )}
    </div>
  );
}

AvatarMakerSelector.propTypes = {
  onSubmit: PropTypes.func,
  height: PropTypes.number,
  width: PropTypes.number
};

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "../input/Button";

export function ReadyPlayerMeAvatarSelector(props) {
  const { onSubmit, height, width } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleEvent(event) {
      const { data } = event;
      // readyPlayerMeのメッセージは文字列だけで来る
      if (typeof data === "string" || data instanceof String) {
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

  const iframeStyle = {
    width: width || "90vw",
    height: height || "80vh",
    position: "fixed",
    top: "50%",
    left: "50%",
    "-webkit-transform": "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
    border: "1px solid"
  };

  return (
    <div>
      <div>
        <Button onClick={handleOpen} preset="accent4">
          <span>{"ReadyPlayerMeのURLを取得"}</span>
        </Button>
      </div>
      {open && (
        <div>
          <iframe
            title="readyplayerme"
            id="readyplayerme_iframe"
            src="https://cyzy.readyplayer.me/avatar"
            className=""
            allow="camera *; microphone *"
            style={iframeStyle}
          />
        </div>
      )}
    </div>
  );
}

ReadyPlayerMeAvatarSelector.propTypes = {
  onSubmit: PropTypes.func,
  height: PropTypes.number,
  width: PropTypes.number
};

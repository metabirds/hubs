import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { RaiseHandPopoverButton } from "./RaiseHandPopover";

function usePresence(scene, initialPresence) {
  const [presence, setPresence] = useState(initialPresence);

  const onPresenceUpdate = ({ detail: presence }) => {
    if (presence.sessionId === NAF.clientId) setPresence(presence);
  };
  useEffect(() => {
    scene.addEventListener("presence_updated", onPresenceUpdate);
    return () => scene.removeEventListener("presence_updated", onPresenceUpdate);
  }, [scene]);

  return presence;
}

export function RaiseHandPopoverContainer({ scene, initialPresence }) {
  const presence = usePresence(scene, initialPresence);

  const onToggleHandRaised = useCallback(() => {
    if (presence.hand_raised) {
      window.APP.hubChannel.lowerHand();
    } else {
      window.APP.hubChannel.raiseHand();
    }
  }, [presence]);

  return <RaiseHandPopoverButton presence={presence} onToggleHandRaised={onToggleHandRaised} />;
}

RaiseHandPopoverContainer.propTypes = {
  scene: PropTypes.object,
  initialPresence: PropTypes.object
};

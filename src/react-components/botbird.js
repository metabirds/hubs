import React, { useState, useEffect } from "react";

const Botbird = () => {
  const [enableCyzyBot, setEnableCyzyBot] = useState(false);
  const [cyzyBotId, setCyzyBotId] = useState("");

  const handleMessage = e => {
    const { cyzyBot, cyzyBotId } = e.data;

    if (cyzyBot === "enable") {
      setEnableCyzyBot(true);
      setCyzyBotId(cyzyBotId);
    } else if (cyzyBot === "disable") {
      setEnableCyzyBot(false);
      setCyzyBotId("");
    }
  };
  window.addEventListener("message", handleMessage);

  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.id = "cyzyBotScript";
    scriptElement.src = cyzyBotId && window.cyzyBotSrc ? window.cyzyBotSrc[cyzyBotId] : "";

    scriptElement.async = true;
    if (scriptElement.src && cyzyBotId) {
      document.body.appendChild(scriptElement);
    }

    const scriptDom = document.getElementById("cyzyBotScript");

    return () => {
      window.removeEventListener("message", handleMessage);
      if (scriptDom) {
        scriptDom.remove();
      }
    };
  }, [cyzyBotId]);

  return enableCyzyBot ? <div id="pastedChatBox" style={{ position: "absolite", pointerEvents: "all" }} /> : null;
};

export default Botbird;

import React, { useState, useEffect } from "react";

const Botbird = () => {
  const [enableCyzyBot, setEnableCyzyBot] = useState(false);
  const [cyzyBotId, setCyzyBotId] = useState("");

  useEffect(() => {
    const handleMessage = e => {
      const { cyzyBot, cyzyBotId } = e.data;

      if (cyzyBotId && cyzyBot === "enable") {
        setEnableCyzyBot(true);
        setCyzyBotId(cyzyBotId);
      } else if (cyzyBot === "disable") {
        setEnableCyzyBot(false);
      }
    };

    window.addEventListener("message", handleMessage);
    const scriptElement = document.createElement("script");
    scriptElement.src =
      cyzyBotId === "bot1"
        ? window.cyzyBotId.bot1
        : cyzyBotId === "bot2"
        ? window.cyzyBotId.bot2
        : cyzyBotId === "bot3"
        ? window.cyzyBotId.bot3
        : "";
    scriptElement.async = true;
    if (scriptElement.src) {
      document.body.appendChild(scriptElement);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
      document.body.removeChild(scriptElement);
    };
  }, [cyzyBotId]);

  return enableCyzyBot ? <div id="pastedChatBox" style={{ position: "absolite", pointerEvents: "all" }} /> : null;
};

export default Botbird;

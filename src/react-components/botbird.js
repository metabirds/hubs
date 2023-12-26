import React, { useState, useEffect } from "react";

const Botbird = () => {
  // ステートを使用してコンポーネントの表示状態を管理
  const [enableBotbird, setEnableBotbird] = useState(false);
  const [chatBoxId, setChatBoxId] = useState("");

  useEffect(() => {
    const handleMessage = e => {
      // event.data には postMessage で送信されたデータが含まれる
      const { type, id } = e.data;

      // メッセージに基づいてコンポーネントの表示状態を更新
      if (id && type === "on") {
        setEnableBotbird(true);
        setChatBoxId(id);
      } else if (type === "off") {
        setEnableBotbird(false);
      }
    };

    // イベントリスナーを追加
    window.addEventListener("message", handleMessage);

    // Scriptタグを実行する
    const scriptElement = document.createElement("script");
    scriptElement.src =
      chatBoxId === "bot1"
        ? window.cyzyBotId.bot1
        : chatBoxId === "bot2"
        ? window.cyzyBotId.bot2
        : chatBoxId === "bot3"
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
  }, [chatBoxId]);

  return enableBotbird ? <div id="pastedChatBox" style={{ position: "absolite", pointerEvents: "all" }} /> : null;
};

export default Botbird;

import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import configs from "../../utils/configs";
import { tryGetTheme, getCurrentTheme, registerDarkModeQuery } from "../../utils/theme";

function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  const changeListener = useCallback(
    event => {
      setDarkMode(event.matches);
    },
    [setDarkMode]
  );

  useEffect(() => {
    const [darkModeQuery, removeListener] = registerDarkModeQuery(changeListener);

    setDarkMode(darkModeQuery.matches);

    return removeListener;
  }, [changeListener]);

  return darkMode;
}

export function useTheme(themeId) {
  const darkMode = useDarkMode();

  useEffect(() => {
    const theme = tryGetTheme(themeId);

    if (!theme) {
      return;
    }

    const variables = [];

    for (const key in theme.variables) {
      if (!Object.prototype.hasOwnProperty.call(theme.variables, key)) continue;
      variables.push(`--${key}: ${theme.variables[key]};`);
    }

    const styleTag = document.createElement("style");

    styleTag.innerHTML = `:root {
        ${variables.join("\n")}
      }`;

    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, [themeId, darkMode]);
}

function getAppLogo(darkMode) {
  const theme = getCurrentTheme();
  const shouldUseDarkLogo = theme ? theme.darkModeDefault || theme.id.includes("dark-mode") : darkMode;
  return (shouldUseDarkLogo && configs.image("logo_dark")) || configs.image("logo");
}

export function useLogo() {
  const darkMode = useDarkMode();
  return getAppLogo(darkMode);
}

export function useThemeFromStore(store) {
  const [themeId, setThemeId] = useState(store?.state?.preferences?.theme);

  useEffect(() => {
    function onStoreChanged() {
      const nextThemeId = store.state?.preferences?.theme;

      if (themeId !== nextThemeId) {
        setThemeId(nextThemeId);
      }
    }

    if (store) {
      store.addEventListener("statechanged", onStoreChanged);
    }

    return () => {
      if (store) {
        store.removeEventListener("statechanged", onStoreChanged);
      }
    };
  });

  useTheme(themeId);
}

// cyzyspace
export function useCyzyCustomAppLogoURL() {
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      // asset server url を取得
      const baseUrl = configs.CYZY_ASSET_SERVER_URL;
      console.log(configs);
      const customAppLogoPath = "custom-app-logo";

      if (!baseUrl) {
        console.error("baseUrl not found");
        setUrl("");
        return;
      }

      // expected room url format
      // https://example.com/roomId
      // https://example.com/hub.html?hub_id=roomId
      let roomId;
      if (window.location.pathname.includes("hub.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        roomId = urlParams.get("hub_id");
      } else {
        const str = window.location.pathname.split("/").filter(Boolean).pop();
        if (str) {
          roomId = str;
        }
      }

      if (!roomId) {
        console.error("roomId not found");
        setUrl("");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/exists/${roomId}/${customAppLogoPath}`);
        const result = await response.json();
        setUrl(result.exists ? `${baseUrl}/assets/${roomId}/${customAppLogoPath}` : "");
      } catch (error) {
        console.error("Error fetching custom app logo:", error);
        setUrl("");
      }
    }
    fetchData();
  }, []);

  return url;
}

export function ThemeProvider({ store, children }) {
  useThemeFromStore(store);
  return children;
}

ThemeProvider.propTypes = {
  store: PropTypes.object,
  children: PropTypes.node
};

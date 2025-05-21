// cyzyspace
import React from "react";

import configs from "../../utils/configs";
import { useCyzyCustomAppLogoURL, useLogo } from "../styles/theme";

export function CyzyCustomAppLogo({ className }: { className?: string }) {
  const customLogo = useCyzyCustomAppLogoURL();
  const logo = useLogo();

  return customLogo !== undefined ? (
    <img className={className} alt={configs.translation("app-name")} src={customLogo || logo} />
  ) : null;
}

import React from "react";

import configs from "../../utils/configs";
import { ReactComponent as HmcLogo } from "../icons/HmcLogo.svg";
import { isHmc } from "../../utils/isHmc";
import { useLogo } from "../styles/theme";

export function AppLogo({ className }: { className?: string }) {
  const logo = useLogo();
  const shouldDisplayHmcLogo = isHmc() && !logo;

  return shouldDisplayHmcLogo ? (
    <HmcLogo className="hmc-logo" />
  ) : (
    <img className={className} alt={configs.translation("app-name")} src={logo} />
  );
}

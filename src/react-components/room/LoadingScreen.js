import React from "react";
import PropTypes from "prop-types";
import { LoadingScreenLayout } from "../layout/LoadingScreenLayout";
import { Spinner } from "../misc/Spinner";
import { useRandomMessageTransition } from "./useRandomMessageTransition";
import configs from "../../utils/configs";

export function LoadingScreen({ message, infoMessages }) {
  const infoMessage = useRandomMessageTransition(infoMessages);
  return (
    <LoadingScreenLayout
      center={
        <>
          <div className="cyzy-loading-message-wrap">
            <div className="cyzy-spinner-wrap">
              <Spinner />
            </div>
            <p>{message}</p>
          </div>
        </>
      }
      bottom={
        <>
          <div className="cyzy-loading-tips-wrap">
            <h3>{infoMessage.heading}</h3>
            <p>{infoMessage.message}</p>
          </div>
          <img src={configs.image("company_logo")} className="cyzy-loading-company-logo" alt={"company-logo"} />
        </>
      }
    />
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.node,
  infoMessages: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.node.isRequired,
      message: PropTypes.node.isRequired
    })
  )
};

LoadingScreen.defaultProps = {
  infoMessages: []
};

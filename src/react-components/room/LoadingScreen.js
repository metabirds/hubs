import React from "react";
import PropTypes from "prop-types";
import { LoadingScreenLayout } from "../layout/LoadingScreenLayout";
import { Spinner } from "../misc/Spinner";
import { useRandomMessageTransition } from "./hooks/useRandomMessageTransition";
import cyzyHowToControlImgPc from "../../assets/images/cyzy-how-to-control-pc.gif";
import cyzyHowToControlImgSp from "../../assets/images/cyzy-how-to-control-sp.gif";
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
          <img
            src={window.ontouchstart === null ? cyzyHowToControlImgSp : cyzyHowToControlImgPc}
            className="cyzy-how-to-control"
            alt={"how to control"}
          />
        </>
      }
      bottom={
        <>
          <div className="cyzy-loading-tips-wrap">
            <h3>{infoMessage.heading}</h3>
            <p>{infoMessage.message}</p>
          </div>
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

import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";

export const LeaveReason = {
  leaveRoom: "leaveRoom",
  joinRoom: "joinRoom",
  createRoom: "createRoom"
};

const reasonMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.message",
    defaultMessage:
      "このルームから退室してウィンドウを閉じます{linebreak}よろしければ退室ボタンをクリックしてください。"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.message",
    defaultMessage: "Joining a new room will leave this one. Are you sure?"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.message",
    defaultMessage: "Creating a new room will leave this one. Are you sure?"
  }
});

const confirmationMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.confirm",
    defaultMessage: "Leave Room"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.confirm",
    defaultMessage: "Join Room"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.confirm",
    defaultMessage: "Leave and Create Room"
  }
});

const closeWindow = function () {
  window.close();
};

export function LeaveRoomModal({ reason, destinationUrl, onClose }) {
  const intl = useIntl();

  return (
    <Modal
      title={<FormattedMessage id="leave-room-modal.title" defaultMessage="Leave Room" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column padding center centerMd="both" grow>
        {reason == "leaveRoom" ? (
          <>
            <h4>
              <FormattedMessage
                id="leave-room-modal.leave-room.message"
                defaultMessage="このルームから退室してウィンドウを閉じます{linebreak}よろしければ退室ボタンをクリックしてください。"
                values={{ linebreak: <br /> }}
              />
            </h4>
            <p>
              <FormattedMessage
                id="leave-room-modal.leave-room.additional"
                defaultMessage="※ウィンドウが閉じない場合はブラウザのタブを閉じる操作をお願い致します。"
              />
            </p>
            <Button preset="cancel" onClick={closeWindow}>
              {intl.formatMessage(confirmationMessages[reason])}
            </Button>
          </>
        ) : (
          <>
            <p>{intl.formatMessage(reasonMessages[reason])}</p>
            <Button as="a" preset="cancel" href={destinationUrl} rel="noopener noreferrer">
              {intl.formatMessage(confirmationMessages[reason])}
            </Button>
          </>
        )}
      </Column>
    </Modal>
  );
}

LeaveRoomModal.propTypes = {
  reason: PropTypes.string,
  destinationUrl: PropTypes.string,
  onClose: PropTypes.func
};

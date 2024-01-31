import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { BackButton } from "../input/BackButton";
import { AvatarSettingsContent } from "./AvatarSettingsContent";
import { FormattedMessage } from "react-intl";
import styles from "./RoomEntryModal.scss";

export function AvatarSetupModal({ className, onBack, ...rest }) {
  return (
    <Modal
      title={<FormattedMessage id="avatar-setup-sidebar.title" defaultMessage="Avatar Setup" />}
      beforeTitle={<BackButton onClick={onBack} />}
      className={className}
    >
      <p className={styles.noteForAudio}>
        {
          "このアプリケーションは、空間内のAIアバターと音声で会話をすることができます。各アバターに近づくと出てくるチャット画面にて「AI音声会話」をONにしてください。"
        }
      </p>
      <AvatarSettingsContent {...rest} />
    </Modal>
  );
}

AvatarSetupModal.propTypes = {
  className: PropTypes.string,
  onBack: PropTypes.func
};

import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { TextInputField } from "../input/TextInputField";
import { useForm } from "react-hook-form";
import { ApplyButton } from "../input/Button";
import { FormattedMessage } from "react-intl";
import { Column } from "../layout/Column";

import { ReadyPlayerMeAvatarSelector } from "./ReadyPlayerMeAvatarSelector";

export function AvatarUrlModal({ onSubmit, onClose }) {
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      url: ""
    }
  });

  const handleReadyPlayerMeUrlSubmit = url => {
    url += "?t=" + Math.floor(Date.now() / 1000);
    setValue("url", url);
  };

  return (
    <Modal title="Custom Avatar URL" beforeTitle={<CloseButton onClick={onClose} />}>
      <Column as="form" padding center onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="url"
          id="custom_avatar_url_input"
          label={<FormattedMessage id="avatar-url-modal.avatar-url-label" defaultMessage="Avatar GLB URL" />}
          placeholder="https://example.com/avatar.glb"
          type="url"
          required
          ref={register}
          description={
            <a href="https://hubs.mozilla.com/docs/intro-avatars.html" target="_blank" rel="noopener noreferrer">
              <FormattedMessage
                id="avatar-url-modal.custom-avatar-docs-link"
                defaultMessage="Learn more about custom avatars"
              />
            </a>
          }
        />
        <ReadyPlayerMeAvatarSelector onSubmit={handleReadyPlayerMeUrlSubmit} />
        <ApplyButton type="submit" />
      </Column>
    </Modal>
  );
}

AvatarUrlModal.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { TextInputField } from "../input/TextInputField";
import { useForm } from "react-hook-form";
import { ApplyButton } from "../input/Button";
import { FormattedMessage } from "react-intl";
import { Column } from "../layout/Column";

import { AvatarMakerSelector } from "./AvatarMakerSelector";

export function AvatarUrlModal({ onSubmit, onClose }) {
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      url: window.localStorage.getItem("avatarUrl") ? window.localStorage.getItem("avatarUrl") : ""
    }
  });

  const handleAvatarMakerUrlSubmit = url => {
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
        />
        <AvatarMakerSelector onSubmit={handleAvatarMakerUrlSubmit} />
        <ApplyButton type="submit" />
      </Column>
    </Modal>
  );
}

AvatarUrlModal.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

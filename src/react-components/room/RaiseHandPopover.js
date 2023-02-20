import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ImageGridPopover } from "../popover/ImageGridPopover";
import { Popover } from "../popover/Popover";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as HandRaisedIcon } from "../icons/HandRaised.svg";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { Column } from "../layout/Column";
import { Row } from "../layout/Row";
import { HandRaisedButton } from "./ReactionButton";
import styles from "./ReactionPopover.scss";
import { Button } from "../input/Button";

const RaiseHandPopoverTitle = defineMessage({
  id: "raise-hand-popover.title",
  defaultMessage: "HELP!"
});

function RaiseHandPopoverContent({ items, presence, onToggleHandRaised, ...rest }) {
  return (
    <Column padding="sm" grow gap="sm">
      <Row noWrap>
        <ImageGridPopover items={items} {...rest} />
      </Row>
      <Row>
        <label className={styles.label}>
          <FormattedMessage id="reaction-popover.action" defaultMessage="Actions" />
        </label>
      </Row>
      <Row nowrap>
        <HandRaisedButton active={presence.hand_raised} onClick={onToggleHandRaised} />
      </Row>
    </Column>
  );
}

RaiseHandPopoverContent.propTypes = {
  items: PropTypes.array.isRequired,
  presence: PropTypes.object,
  onToggleHandRaised: PropTypes.func
};

function TooltipPopoverContent({ onToggleHandRaised }) {
  return (
    <Row nowrap className={styles.popover}>
      <Column padding="xs" grow gap="xs">
        <HandRaisedIcon width="32px" height="32px" style={{ marginLeft: "5px" }} />
      </Column>
      <Column padding="xs" grow gap="xs">
        <FormattedMessage id="reaction-popover.hand-raised-warning" defaultMessage="Your hand is raised" />
      </Column>
      <Column padding="xs" grow gap="xs">
        <Button sm thin preset={"primary"} onClick={onToggleHandRaised}>
          <FormattedMessage id="reaction-popover.lower-hand" defaultMessage="Lower Hand" />
        </Button>
      </Column>
    </Row>
  );
}

TooltipPopoverContent.propTypes = {
  onToggleHandRaised: PropTypes.func
};

export function RaiseHandPopoverButton({ presence, onToggleHandRaised }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const intl = useIntl();
  const title = intl.formatMessage(RaiseHandPopoverTitle);
  const popoverApiRef = useRef();

  const onTooltipHandLowered = useCallback(() => {
    setIsTooltipVisible(false);
    onToggleHandRaised();
  }, [onToggleHandRaised]);

  return (
    <Popover
      title={title}
      content={() => {
        return <TooltipPopoverContent onToggleHandRaised={onTooltipHandLowered} />;
      }}
      placement="top"
      offsetDistance={28}
      popoverApiRef={popoverApiRef}
      showHeader={false}
      isVisible={presence.hand_raised}
      onChangeVisible={() => {
        setIsTooltipVisible(true);
      }}
      disableFullscreen={true}
    >
      {({ popoverVisible, triggerRef }) => (
        <ToolbarButton
          ref={triggerRef}
          icon={<HandRaisedIcon width="32px" height="32px" style={{ marginLeft: "3px" }} />}
          selected={popoverVisible}
          onClick={() => {
            onToggleHandRaised();
            console.log("hand_raise:", presence.hand_raised);
            if (presence.hand_raised) {
              setIsTooltipVisible(true);
            }
          }}
          label={title}
          preset="accent1"
          className="raiseHandButton"
          toolbarDescription={
            <FormattedMessage id="toolbar-description.raise-hand-button" defaultMessage="挙手をして助けを求めます" />
          }
        />
      )}
    </Popover>
  );
}

RaiseHandPopoverButton.propTypes = {
  presence: PropTypes.object,
  onToggleHandRaised: PropTypes.func
};

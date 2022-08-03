import React, { useState } from "react";
import styled from "styled-components";
import { Avatar } from "~/components/shared";
import { HtmlTooltip } from "~/components/shared/tooltip";

interface ParticipantsAvatarsProps {
  entityList: any[];
}

export const ParticipantsAvatars = ({ entityList }: ParticipantsAvatarsProps): JSX.Element => {
  const [showTooltip, setShowTooltip] = useState(false);

  const avatarsToShow = entityList.length <= 5 ? entityList : entityList.slice(0, 4);

  const entityNamesArray = entityList.map(entity => {
    if (entity.role) {
      return `${entity.firstName} ${entity.lastName}`;
    } else if (entity.type === "user") {
      return `${entity.name} ${entity.lastName}`;
    } else {
      return entity.name;
    }
  });

  const tooltipText =
    entityNamesArray.join(", ").length > 140
      ? entityNamesArray.join(", ").substring(0, 140) + "..."
      : entityNamesArray.join(", ");

  return (
    <HtmlTooltip arrow={true} open={showTooltip} title={<span>{tooltipText}</span>}>
      <AvatarContainer
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {avatarsToShow.map((avatar, index) => (
          <AvatarDiv key={`${avatar}-${index}`}>
            <Avatar
              defaultAvatarColor={avatar?.defaultAvatarColor}
              avatarUrl={avatar.avatarUrl}
              firstName={avatar.name || ""}
              lastName={avatar.lastName || ""}
              size={32}
              marginLeft={"0px"}
            />
          </AvatarDiv>
        ))}
        {entityList.length > 5 && (
          <AvatarDiv>
            <Avatar
              defaultAvatarColor={"grey100"}
              firstName={`+`}
              lastName={`${entityList.length - 4}`}
              size={32}
              marginLeft={"0px"}
            />
          </AvatarDiv>
        )}
      </AvatarContainer>
    </HtmlTooltip>
  );
};

const AvatarContainer = styled.div`
  display: inline-flex;
`;

const AvatarDiv = styled.span`
  position: relative;
  border: 2px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  width: 32px;

  &:not(:first-child) {
    margin-left: -16px;
  }
`;

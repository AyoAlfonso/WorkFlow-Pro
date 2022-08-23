import * as React from "react";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Icon } from "~/components/shared";
import { Button } from "~/components/shared/button";
import { baseTheme } from "~/themes";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import moment from "moment";
import { createTemplate } from "~/utils/check-in-functions";

interface CheckInTemplateCardProps {
  name: string;
  description: string;
  tags: Array<string>;
  id: number;
  checkInTemplate: any;
  updateStatus?: (id: number) => void;
}

export const CheckInTemplateCard = observer(
  ({
    name,
    description,
    tags,
    id,
    checkInTemplate,
    updateStatus,
  }: CheckInTemplateCardProps): JSX.Element => {
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const {
      checkInTemplateStore,
      checkInTemplateStore: { runCheckinOnce, createCheckinTemplate, publishCheckinTemplate },
      sessionStore: { profile },
    } = useMst();

    const optionsRef = useRef(null);

    const history = useHistory();

    useEffect(() => {
      const externalEventHandler = e => {
        if (!showOptions) return;

        const node = optionsRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setShowOptions(false);
      };

      if (showOptions) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, [showOptions]);

    const currentUser = profile && {
      id: profile?.id,
      type: "user",
      defaultAvatarColor: profile?.defaultAvatarColor,
      avatarUrl: profile?.avatarUrl,
      name: profile?.firstName,
      lastName: profile?.lastName,
    };

    const filteredTags = tags.filter(tag => tag);

    const handleRunNow = () => {
      const checkin = {
        name: checkInTemplate.name,
        checkInTemplatesStepsAttributes: checkInTemplate.checkInTemplatesSteps,
        participants: [currentUser],
        anonymous: false,
        checkInType: "dynamic",
        ownerType: checkInTemplate.ownerType.toLowerCase(),
        description: checkInTemplate.description,
        timeZone: checkInTemplate.timeZone,
        viewers: [currentUser],
        runOnce: new Date(),
        dateTimeConfig: {
          cadence: "once",
          time: moment(new Date(), ["hh:mm A"]).format("HH:mm"),
          date: new Date(),
          day: "",
        },
        reminder: {
          unit: checkInTemplate.reminder.unit,
          value: checkInTemplate.reminder.value,
        },
        tag: ["global", "custom"],
        parent: checkInTemplate.id,
      };

      createCheckinTemplate(checkin).then(id => {
        runCheckinOnce(id).then(artifactId => {
          if (artifactId) {
            history.push(`/check-in/run/${artifactId}`);
          }
        });
      });
    };

    const handlePublish = () => {
      publishCheckinTemplate(checkInTemplate.id).then(res => {
        if (res) {
          setShowOptions(false);
          showToast("Template published successfully", ToastMessageConstants.SUCCESS);
          updateStatus(checkInTemplate.id);
        }
      });
    };

    const makeACopy = () => {
      createTemplate(checkInTemplate, checkInTemplateStore, history);
    };

    return (
      <Container>
        <HeaderContainer>
          <Title>{name}</Title>
          <OptionsIconContainer ref={optionsRef}>
            <IconContainer onClick={() => setShowOptions(!showOptions)}>
              <StyledOptionIcon icon={"Options"} size={"13px"} iconColor={"grey80"} />
            </IconContainer>
            {showOptions && (
              <OptionsContainer>
                <Option onClick={makeACopy}>Make a copy</Option>
                {checkInTemplate.status == "draft" && (
                  <Option onClick={handlePublish}>Publish</Option>
                )}
                <Option
                  onClick={() => {
                    history.push(`/check-in/template/edit/${checkInTemplate.id}`);
                  }}
                >
                  Edit
                </Option>
              </OptionsContainer>
            )}
          </OptionsIconContainer>
        </HeaderContainer>
        <Description>{description}</Description>
        <BottomRow>
          <ButtonsContainer>
            <Button
              variant={"primary"}
              mr="1em"
              width="70px"
              fontSize="12px"
              onClick={() => history.push(`/check-in/setup/${id}`)}
              small
              style={{ whiteSpace: "nowrap" }}
            >
              Set up
            </Button>
            {checkInTemplate.status == "draft" ? (
              <Button
                variant={"primaryOutline"}
                mr="1em"
                width="70px"
                fontSize="12px"
                onClick={handlePublish}
                small
                style={{ whiteSpace: "nowrap" }}
              >
                Publish
              </Button>
            ) : (
              <Button
                variant={"primaryOutline"}
                mr="1em"
                width="70px"
                fontSize="12px"
                onClick={handleRunNow}
                small
                style={{ whiteSpace: "nowrap" }}
              >
                Run now
              </Button>
            )}
          </ButtonsContainer>

          {checkInTemplate.status == "draft" ? (
            <Tag bgColor={baseTheme.colors.lightYellow} color={baseTheme.colors.tango}>
              Draft
            </Tag>
          ) : (
            <TagsContainer>
              {filteredTags.map((tag, index) => (
                <Tag
                  color={tag == "Custom" ? baseTheme.colors.primary100 : ""}
                  key={`${tag}-${index}`}
                >
                  {tag.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                </Tag>
              ))}
            </TagsContainer>
          )}
        </BottomRow>
      </Container>
    );
  },
);

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 1em;
  height: 140px;
  padding: 1em 1.5em;
  position: relative;
  margin-right: ;
  // max-width: 350px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OptionsIconContainer = styled.div`
  position: relative;
  display: flex;
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
  pointer-events: none;
`;

const OptionsContainer = styled.div`
  position: absolute;
  padding: 0.5em 0;
  z-index: 10;
  border-radius: 0.5em;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  width: max-content;
  right: 0;
`;

const Option = styled.div`
  padding: 0.5em 1em;
  font-size: 0.75em;
  cursor: pointer;
  color: ${props => props.theme.colors.black};

  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const Title = styled.span`
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  display: block;
  font-family: "Exo";
`;

const Description = styled.span`
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 12px;
  display: inline-block;
  line-spacing: 1.5em;
`;

const BottomRow = styled.div`
  display: flex;
  position: absolute;
  justify-content: space-between;
  align-items: center;
  bottom: 1em;
  right: 1.5em;
  left: 1.5em;
`;
const ButtonsContainer = styled.div`
  display: flex;
`;
const TagsContainer = styled.div`
  display: flex;
`;

type TagProps = {
  color?: string;
  bgColor?: string;
};

const Tag = styled.span<TagProps>`
  display: inline-block;
  padding: 0.5em;
  color: ${props => (props.color ? props.color : props.theme.colors.grey100)};
  background-color: ${props => (props.bgColor ? props.bgColor : props.theme.colors.grey20)};
  font-size: 0.75em;
  margin-right: 0.75em;
  border-radius: 4px;
  font-weight: bold;

  &:last-child {
    margin-right: 0;
  }
`;

const DraftTag = styled(Tag)`
  padding: 0 0.5em;
  display: flex;
  align-items: center;
`;

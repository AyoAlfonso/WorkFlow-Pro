import React, { useState, useCallback } from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { Button } from "rebass";
import { useTranslation } from "react-i18next";
import { baseTheme } from "../../../themes";
import styled from "styled-components";
import { getCroppedImg } from "~/lib/cropImage";
import "~/stylesheets/utilities.css";
import Cropper from "react-easy-crop";

export interface IAvatarModalProps {
  image: string;
  uploadCroppedImage: any;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AvatarModal = ({
  image,
  uploadCroppedImage,
  modalOpen,
  setModalOpen,
}: IAvatarModalProps): JSX.Element => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const { t } = useTranslation();
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback(
    async (croppedArea, croppedAreaPixels) => {
      try {
        const newCroppedImage = await getCroppedImg({
          image,
          pixelCrop: croppedAreaPixels,
        });

        setCroppedImage(newCroppedImage);
      } catch (e) {}
    },
    [image],
  );

  return (
    <ModalWithHeader
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      headerText={t("profile.updateProfileAvatar")}
      width="480px"
      overflow="hidden"
      boxSizing="border-box"
    >
      <Container>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          restrictPosition={true}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Container>

      <StyledButton
        onClick={() => {
          uploadCroppedImage(croppedImage);
          setModalOpen(!modalOpen);
        }}
      >
        Save changes
      </StyledButton>
      <StyledButton
        onClick={() => setModalOpen(!modalOpen)}
        intent={"cancel"}
      >
        Cancel
      </StyledButton>
    </ModalWithHeader>
  );
};

type StyledButtonType = {
  disabled: boolean;
};

const StyledButton = styled(Button)<StyledButtonType>`
  background-color: ${props =>
    props.intent === "cancel"
      ? baseTheme.colors.warningRed
      : props.disabled
      ? baseTheme.colors.grey60
      : baseTheme.colors.primary100};
  width: 130px;
  height: 35px;
  margin: 10px 10px 10px !important;
  &: hover {
    cursor: ${props => !props.disabled && "pointer"};
  }
`;

const Container = styled.div`
  height: 60vh;
`;

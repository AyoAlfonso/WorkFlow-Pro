import React, { useState, useCallback } from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useTranslation } from "react-i18next";
import { baseTheme } from "../../../themes";
import styled from "styled-components";
import { getCroppedImg } from "~/lib/cropImage";
import Cropper from "react-easy-crop";
import { Button } from "~/components/shared/button";

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
      centerHeader={true}
      setModalOpen={setModalOpen}
      headerText={t("profile.updateProfileAvatar")}
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
      <ButtonContainer>
        <Button
          small
          variant={"redOutline"}
          m={1}
          style={{ width: "auto", display: "inline-block" }}
          onClick={() => setModalOpen(!modalOpen)}
        >
          {t("general.cancel")}
        </Button>
        <Button
          small
          variant={"primary"}
          m={1}
          style={{ width: "auto", display: "inline-block" }}
          onClick={() => {
            uploadCroppedImage(croppedImage);
            setModalOpen(!modalOpen);
          }}
        >
          {t("general.save")}
        </Button>
      </ButtonContainer>
    </ModalWithHeader>
  );
};

type StyledButtonType = {
  disabled: boolean;
};

const Container = styled.div`
  height: 30rem;
`;

const ButtonContainer = styled.div`
  margin: 0 25%;
  padding-bottom: 4px;
`;

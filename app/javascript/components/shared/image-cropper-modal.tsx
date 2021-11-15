import React, { useState, useCallback } from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useTranslation } from "react-i18next";
import { baseTheme } from "~/themes";
import styled from "styled-components";
import { getCroppedImg } from "~/lib/cropImage";
import "~/stylesheets/modules/react-easy-crop.css";
import Cropper from "react-easy-crop";
import { Button } from "~/components/shared/button";

export interface IImageCropperModalProps {
  image: string;
  uploadCroppedImage: any;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText: string;
}

export const ImageCropperModal = ({
  image,
  uploadCroppedImage,
  modalOpen,
  setModalOpen,
  headerText,
}: IImageCropperModalProps): JSX.Element => {
  type cropCoordinates = {
    x: number;
    y: number;
  };
  const [crop, setCrop] = useState<cropCoordinates>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const { t } = useTranslation();
  const [croppedImage, setCroppedImage] = useState<any>(null);

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
      headerText={headerText}
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
        <StyledButton
          small
          variant={"primary"}
          m={1}
          onClick={() => {
            uploadCroppedImage(croppedImage);
            setModalOpen(!modalOpen);
          }}
        >
          {t("general.save")}
        </StyledButton>
        <StyledButton small variant={"redOutline"} m={1} onClick={() => setModalOpen(!modalOpen)}>
          {t("general.cancel")}
        </StyledButton>
      </ButtonContainer>
    </ModalWithHeader>
  );
};

const StyledButton = styled(Button)`
  width: auto;
  display: inline-block;
`;

const Container = styled.div`
  height: 30rem;
`;

const ButtonContainer = styled.div`
  margin-left: 8px;
  padding: 4px;
`;

import React, { useState } from "react";
import * as R from "ramda";

import { Dropzone } from "./dropzone"

import { ImageCropperModal } from "~/components/shared"

export interface IDropzoneWithCropperProps {
  classes: Record<"previewChip", string>;
  formData: any;
  formKeys: any;
  callback: any;
}

export const DropzoneWithCropper = ({
  classes,
  formData,
  formKeys,
  callback,
}: IDropzoneWithCropperProps): JSX.Element => {
  const [imageblub, setImageblub] = useState<any | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");

  const submitImage = async (blob: any) => {
    const imageDataUrl = await readFile(blob);
    const f_obj = { data: imageDataUrl, file: { name: filename, path: filename } }
    callback(formKeys, [f_obj]);
  }

  const pickImageblob = async (file: any) => {
    setImageblub(file)
    setImageModalOpen(!imageModalOpen)
  };
  const readFile = (file: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }
  const inputFileUpload = async (files: any) => {
    const imageDataUrl = await readFile(files[0].file)
    setFilename(files[0].file.name)
    pickImageblob(imageDataUrl)
  }
  const croppedDropZoneText =
    R.isNil(R.path(formKeys, formData)) || R.isEmpty(R.path(formKeys, formData))
      ? "Drag 'n' drop some files here, or click to select files"
      : "";
  return (
    <>
      <Dropzone
        classes={classes}
        dropzoneText={croppedDropZoneText}
        onAdd={(f: any) => {
          inputFileUpload(f);
        }}
        onDelete={(_: any) => {
          callback(formKeys, []);
        }}
        fileObjects={R.path(formKeys, formData) ? R.path(formKeys, formData) : []}
        previewText="Selected files"
      />
      {imageModalOpen && (
        <ImageCropperModal
          image={imageblub}
          uploadCroppedImage={submitImage}
          modalOpen={imageModalOpen}
          setModalOpen={setImageModalOpen}
          headerText={"Crop Image"}
        />
      )}
    </>
  );
}

import React from "react";

import { baseTheme } from "~/themes/base";

import { DropzoneAreaBase as MuiDropzoneAreaBase } from "material-ui-dropzone";
import { withStyles } from "@material-ui/core/styles";

export interface IDropzoneProps {
  classes: Record<"previewChip", string>;
  onAdd: any;
  onDelete: any;
  dropzoneText: string;
  fileObjects: Array<any>;
  previewText: string;
}

export const Dropzone = ({
  classes,
  onAdd,
  onDelete,
  dropzoneText,
  fileObjects,
  previewText,
}: IDropzoneProps): JSX.Element => {
  return (
    <StyledDropzone
      Icon={null}
      acceptedFiles={["image/*"]}
      dropzoneText={dropzoneText}
      useChipsForPreview
      onAdd={onAdd}
      onDelete={onDelete}
      showPreviews={true}
      showPreviewsInDropzone={false}
      filesLimit={1}
      maxFileSize={2000000}
      fileObjects={fileObjects}
      previewGridProps={{ container: { spacing: 1, direction: "row" } }}
      previewChipProps={{ classes: { root: classes.previewChip } }}
      previewText={previewText}
    />
  )
}

const StyledDropzone = withStyles({
  active: {
    backgroundColor: baseTheme.colors.primary20,
  },
  icon: {
    display: "none",
  },
  root: {
    height: "120px",
    width: "100%",
    borderRadius: 10,
    borderWidth: "2px",
  },
  textContainer: {
    marginTop: "15%",
  },
  text: {
    fontSize: "14px",
    color: baseTheme.colors.borderGrey,
  },
})(MuiDropzoneAreaBase);

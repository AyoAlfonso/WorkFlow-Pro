import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
// import "@pathofdev/react-tag-input/build/index.css";
import "node_modules/@pathofdev/react-tag-input/src/styles/index.scss";

interface IMultiTagInputProps {
  options: Array<any>;
  validator?: any;
}

//we are passing the props we want to put into the input field as an array
//We are summarizing after three inputs to 3+
export const MultiTagInput = ({ options }: IMultiTagInputProps): JSX.Element => {
  const [tags, setTags] = useState([options]);
  useEffect(() => {
    onChangeTags();
  }, [options]);

  const onChangeTags = () => {
    if (options.length > 3) {
      setTags([...options, { value: "3+", id: null }]);
    } else {
      setTags(options);
    }
  };
  return (
    // <ReactTagInput
    //   editable={false}
    //   readOnly={false}
    //   removeOnBackspace={true}
    //   tags={tags}
    //   // validator={validator}
    // />
    <></>
  );
};

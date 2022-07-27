import React from "react";
import { Button, Popover } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";

import { componentTypes } from "@data-driven-forms/react-form-renderer";
import nextStepMapper from "./imageOutputStepMapper";

export default {
  id: "wizard-image-output",
  title: "Image output",
  name: "image-output",
  nextStep: ({ values }) => nextStepMapper(values),
  fields: [
    {
      component: "blueprint-name",
      name: "blueprint-name",
    },
    {
      component: "image-output-select",
      name: "image-output-type",
      label: "Type",
    },
    {
      name: "image-upload",
      component: componentTypes.CHECKBOX,
      label: (
        <>
          Upload to AWS
          <Popover
            bodyContent="
                      Image Builder can upload images you create to an {bucket} in AWS and then import them into EC2. When the image build is complete
                      and the upload action is successful, the image file is available in the AMI section of EC2. Most of the values required to upload
                      the image can be found in the {console}.
                      This upload process requires that you have an {iam} role named {vmimport} to ensure that the image can
                      be imported from the S3 {bucket} into EC2. For more details, refer to the {role}.
                    "
            aria-label="AWS upload help"
          >
            <Button className="upload-checkbox-popover-button" variant="plain" aria-label="AWS upload help">
              <OutlinedQuestionCircleIcon />
            </Button>
          </Popover>
        </>
      ),
      condition: {
        when: "image-output-type",
        is: "ami",
      },
    },
  ],
};
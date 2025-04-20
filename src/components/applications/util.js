import { validApplicationStates } from "../../state/constants";

export const handleStatusDropdownClose = (form) => {
  const status = form.getValues().status;
  const match = validApplicationStates.find((item) =>
    item.toLowerCase().startsWith(status.toLowerCase())
  );
  if (match && status !== match) {
    form.setFieldValue("status", match);
  } else {
    form.setFieldValue("status", match);
  }
};

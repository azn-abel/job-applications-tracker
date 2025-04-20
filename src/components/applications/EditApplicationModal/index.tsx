import {
  Modal,
  Button,
  Flex,
  TextInput,
  Select,
  Textarea,
  LoadingOverlay,
  Autocomplete,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import localStorageAPI from "../../../api/applications";

import { uniqueJobTitlesAtom, uniqueCompaniesAtom } from "../../../state";
import { useAtom } from "jotai";

import { validApplicationStates } from "../../../state/constants";
import { handleStatusDropdownClose } from "../util";

import { useState, useEffect } from "react";
import {
  Application,
  ApplicationDTO,
  DateString,
} from "../../../types/applications";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EditApplicationModal({
  opened,
  open,
  close,
  application,
  callback,
}: {
  opened: boolean;
  open: () => void;
  close: () => void;
  application: Application | null;
  callback: () => void;
}) {
  const [uniqueJobTitles] = useAtom(uniqueJobTitlesAtom);
  const [uniqueCompanies] = useAtom(uniqueCompaniesAtom);

  const form = useForm<ApplicationDTO>({
    mode: "uncontrolled",
    initialValues: {
      jobTitle: "",
      company: "",
      status: "New",
      applicationDate: "",
      interviewDate: "",
      jobDescription: "",
    },
    validate: {
      jobTitle: isNotEmpty("Required"),
      company: isNotEmpty("Required"),
      status: (value) =>
        validApplicationStates.includes(value) ||
        "Status must be one of: New, Assessment, Interview, Offer, Rejected",
      applicationDate: isNotEmpty("Required"),
    },
  });

  const [fetching, setFetching] = useState(false);

  const updateApplication = async (values: ApplicationDTO) => {
    const body = { ...values };
    body.interviewDate = formatDate(body.interviewDate) || "";
    body.applicationDate = formatDate(body.applicationDate) || "";

    if (body.interviewDate && ["New", "Assessment"].includes(body.status))
      body.status = "Interview";

    setFetching(true);
    let result;
    if (application)
      result = localStorageAPI.putApplication(application?.id, body);
    setFetching(false);
    if (!result) {
      // TODO: something went wrong
    }

    close();
    callback();
  };

  const removeApplication = async () => {
    setFetching(true);
    application && localStorageAPI.deleteApplication(application?.id);
    setFetching(false);

    close();
    callback();
  };

  useEffect(() => {
    form.setValues({
      jobTitle: application?.jobTitle || "",
      company: application?.company || "",
      status: application?.status || "New",
      jobDescription: application?.jobDescription || "",
      applicationDate: application?.applicationDate
        ? formatDate(application?.applicationDate)
        : "",
      interviewDate: application?.interviewDate
        ? formatDate(application?.interviewDate)
        : "",
    });
  }, [application]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="View and Edit Application"
        removeScrollProps={{
          allowPinchZoom: true,
        }}
        centered
        size="lg"
      >
        <LoadingOverlay visible={fetching} zIndex={1000} />
        <form
          onSubmit={form.onSubmit(updateApplication)}
          onKeyDown={(e) => {
            if (
              e.code === "Enter" &&
              (e.target as HTMLInputElement).tagName !== "TEXTAREA"
            ) {
              e.preventDefault();
            }
          }}
        >
          <Autocomplete
            label="Job Title"
            placeholder="Job Title"
            withAsterisk
            data={uniqueJobTitles}
            key={form.key("jobTitle")}
            {...form.getInputProps("jobTitle")}
          />
          <Autocomplete
            label="Company"
            placeholder="Company Name"
            data={uniqueCompanies}
            withAsterisk
            key={form.key("company")}
            {...form.getInputProps("company")}
          />
          <Select
            label="Status"
            placeholder="Status"
            defaultValue={application?.status}
            data={["New", "Assessment", "Interview", "Offer", "Rejected"]}
            onDropdownClose={() => handleStatusDropdownClose(form)}
            withAsterisk
            key={form.key("status")}
            {...form.getInputProps("status")}
          />
          <DateInput
            label="Application Date"
            valueFormat="YYYY-MM-DD"
            placeholder="Choose Date"
            preserveTime={false}
            firstDayOfWeek={0}
            weekendDays={[]}
            withAsterisk
            onTouchEnd={(e) => ((e.target as HTMLInputElement).readOnly = true)}
            key={form.key("applicationDate")}
            {...form.getInputProps("applicationDate")}
          />
          <DateInput
            label="Interview Date"
            valueFormat="YYYY-MM-DD"
            placeholder="Choose Date"
            clearable
            preserveTime={false}
            firstDayOfWeek={0}
            weekendDays={[]}
            onTouchEnd={(e) => ((e.target as HTMLInputElement).readOnly = true)}
            key={form.key("interviewDate")}
            {...form.getInputProps("interviewDate")}
          />
          <Textarea
            label="Job Description"
            placeholder="Job Description"
            rows={8}
            maxLength={20000}
            key={form.key("jobDescription")}
            {...form.getInputProps("jobDescription")}
          />
          <Flex justify="space-between" mt={16}>
            <Button
              mr={16}
              color="red"
              onClick={removeApplication}
              style={{ justifySelf: "start" }}
            >
              Delete
            </Button>
            <Flex>
              <Button mr={16} color="red" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

function formatDate(date?: Date | DateString): DateString {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD") as DateString;
}

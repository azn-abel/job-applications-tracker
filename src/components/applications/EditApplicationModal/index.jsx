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

import { useState, useEffect } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EditApplicationModal({
  opened,
  open,
  close,
  application,
  callback,
}) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      jobTitle: "",
      company: "",
      status: "",
      applicationDate: null,
      interviewDate: null,
      jobDescription: "",
    },
    validate: {
      jobTitle: isNotEmpty("Required"),
      company: isNotEmpty("Required"),
      status: isNotEmpty("Required"),
      applicationDate: isNotEmpty("Required"),
    },
  });

  const [fetching, setFetching] = useState(false);

  const updateApplication = async (values) => {
    const body = { ...values };
    body.interviewDate = formatDate(body.interviewDate);
    body.applicationDate = formatDate(body.applicationDate);

    setFetching(true);
    const result = localStorageAPI.putApplication(application?.id, body);
    setFetching(false);
    if (!result) {
      // TODO: something went wrong
    }

    close();
    callback();
  };

  const removeApplication = async () => {
    setFetching(true);
    const result = localStorageAPI.deleteApplication(application?.id);
    setFetching(false);
    if (!result) {
      // TODO: something went wrong
    }

    close();
    callback();
  };

  useEffect(() => {
    form.setValues({
      jobTitle: application?.jobTitle || "",
      company: application?.company || "",
      status: application?.status || "",
      jobDescription: application?.jobDescription || "",
      applicationDate: application?.applicationDate
        ? dayjs(application?.applicationDate)
        : null,
      interviewDate: application?.interviewDate
        ? dayjs(application?.interviewDate)
        : null,
    });
  }, [application]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="View and Edit Application"
        centered
        size="lg"
      >
        <LoadingOverlay visible={fetching} zIndex={1000} />
        <form onSubmit={form.onSubmit(updateApplication)}>
          <TextInput
            label="Job Title"
            placeholder="Job Title"
            withAsterisk
            key={form.key("jobTitle")}
            {...form.getInputProps("jobTitle")}
          />
          <Autocomplete
            label="Company"
            placeholder="Company Name"
            data={[]}
            withAsterisk
            key={form.key("company")}
            {...form.getInputProps("company")}
          />
          <Select
            label="Status"
            placeholder="Status"
            defaultValue={application?.status}
            data={["New", "Assessment", "Interview", "Offer", "Rejected"]}
            withAsterisk
            key={form.key("status")}
            {...form.getInputProps("status")}
          />
          <DateInput
            label="Application Date"
            valueFormat="YYYY-MM-DD"
            placeholder="Choose Date"
            allowDeselect
            clearable
            preserveTime={false}
            firstDayOfWeek={0}
            weekendDays={[]}
            withAsterisk
            key={form.key("applicationDate")}
            {...form.getInputProps("applicationDate", { type: "date" })}
          />
          <DateInput
            label="Interview Date"
            valueFormat="YYYY-MM-DD"
            placeholder="Choose Date"
            allowDeselect
            clearable
            preserveTime={false}
            firstDayOfWeek={0}
            weekendDays={[]}
            key={form.key("interviewDate")}
            {...form.getInputProps("interviewDate", { type: "date" })}
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
              <Button type="submit">Submit</Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

function formatDate(date) {
  if (!date) return null;
  return dayjs(date).format("YYYY-MM-DD");
}

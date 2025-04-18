import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Flex,
  TextInput,
  Autocomplete,
  Select,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import localStorageAPI from "../../../api/applications";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function AddApplicationModal({ callback }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [fetching, setFetching] = useState(false);

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

  const createApplication = async (values) => {
    const body = { ...values };
    body.applicationDate = formatDate(body.applicationDate);
    body.interviewDate = formatDate(body.interviewDate);

    if (body.interviewDate && ["New", "Assessment"].includes(body.status))
      body.status = "Interview";

    setFetching(true);
    const result = localStorageAPI.postApplication(body);
    setFetching(false);
    if (!result) {
      //something went wrong
      return;
    }
    close();
    callback();
  };

  useEffect(() => {
    form.setValues({
      jobTitle: "",
      company: "",
      status: "",
      jobDescription: "",
      applicationDate: null,
      interviewDate: null,
    });
  }, [opened]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Add Application"
        centered
        size="lg"
      >
        <LoadingOverlay visible={fetching} zIndex={1000} />
        <form onSubmit={form.onSubmit(createApplication)}>
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
            data={["New", "Assessment", "Interview", "Offer", "Rejected"]}
            withAsterisk
            key={form.key("status")}
            {...form.getInputProps("status")}
          />
          <DateInput
            label="Application Date"
            valueFormat="YYYY-MM-DD"
            placeholder="Choose Date"
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
            key={form.key("jobDescroption")}
            {...form.getInputProps("jobDescription")}
          />
          <Flex justify="flex-end" mt={16}>
            <Button mr={16} color="red" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Flex>
        </form>
      </Modal>

      <Button variant="default" onClick={open}>
        Add
      </Button>
    </>
  );
}

function formatDate(date) {
  if (!date) return null;
  return dayjs(date).format("YYYY-MM-DD");
}

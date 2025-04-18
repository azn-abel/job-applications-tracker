import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Flex, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import localStorageAPI from "../../../api/applications";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { useAtom } from "jotai";
import { selectedRowsAtom } from "../../../atoms";

export default function DeleteSelectedApplicationModal({ callback }) {
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom);

  const deleteApplications = async () => {
    for (let row of selectedRows) {
      console.log(row);
      localStorageAPI.deleteApplication(row);
    }
    setSelectedRows([]);
    close();
    callback();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Delete Applications"
        centered
        size="md"
      >
        <Text>
          Are you sure you want to delete {selectedRows.length} application
          {selectedRows.length !== 1 && "s"}?
        </Text>

        <Flex justify="flex-end" mt={16} gap={12}>
          <Button variant="default" onClick={close}>
            Back
          </Button>
          <Button color="red" onClick={deleteApplications}>
            Yes, I'm Sure
          </Button>
        </Flex>
      </Modal>

      <Button color="red" onClick={open}>
        Delete
      </Button>
    </>
  );
}

function formatDate(date) {
  if (!date) return null;
  return dayjs(date).format("YYYY-MM-DD");
}

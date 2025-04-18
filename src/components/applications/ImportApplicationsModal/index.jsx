import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Modal, Button } from "@mantine/core";
import { FileButton, Group, Text, Flex } from "@mantine/core";
import { importCSV } from "../../../api/io";
import localStorageAPI from "../../../api/applications";

export default function ImportApplicationsModal({ callback }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onClose = () => {
    close();
    setFile(null);
  };

  const handleImport = async () => {
    setError("");
    if (!file) return;
    try {
      const results = await importCSV(file);
      for (let result of results) {
        localStorageAPI.postApplication(result);
      }
      onClose();
      callback();
    } catch (e) {
      setError("Something went wrong.");
      console.log(e);
    }
  };

  return (
    <>
      <Modal opened={opened} centered onClose={onClose} title="Import CSV">
        <Group justify="center">
          <FileButton
            mt={4}
            onChange={setFile}
            accept="text/csv"
            variant="default"
          >
            {(props) => <Button {...props}>Select a file</Button>}
          </FileButton>
        </Group>

        <Text size="sm" ta="center" mt="sm">
          {file ? `Selected file: ${file?.name}` : "No file selected."}
        </Text>

        {error && (
          <Text size="sm" ta="center" mt="sm" c="red">
            {error}
          </Text>
        )}
        <Flex justify="end" mt={12} gap={12}>
          <Button disabled={!file} onClick={handleImport}>
            Import
          </Button>
        </Flex>
      </Modal>

      <Button variant="default" onClick={open}>
        Import
      </Button>
    </>
  );
}

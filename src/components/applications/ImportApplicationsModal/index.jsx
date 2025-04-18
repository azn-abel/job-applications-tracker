import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Modal, Button } from "@mantine/core";
import { FileButton, Group, Text, Flex } from "@mantine/core";

export default function ImportApplicationsModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState(null);

  const onClose = () => {
    close();
    setFile(null);
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
        <Flex justify="end" mt={12} gap={12}>
          <Button disabled={!file} onClick={onClose}>
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

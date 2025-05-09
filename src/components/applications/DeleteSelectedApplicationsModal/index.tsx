import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Flex, Text } from '@mantine/core'
import ApplicationsAPI from '../../../api/applications'

import { useAtom } from 'jotai'
import { selectedRowsAtom } from '../../../state'

export default function DeleteSelectedApplicationModal({
  callback,
}: {
  callback: () => void
}) {
  const [opened, { open, close }] = useDisclosure(false)

  const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom)

  const deleteApplications = async () => {
    for (let row of selectedRows) {
      ApplicationsAPI.deleteApplication(row)
    }
    setSelectedRows([])
    close()
    callback()
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Delete Applications"
        centered
        removeScrollProps={{
          allowPinchZoom: true,
        }}
        size="md"
      >
        <Text>
          Are you sure you want to delete {selectedRows.length} application
          {selectedRows.length !== 1 && 's'}?
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
  )
}

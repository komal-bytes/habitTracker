// components/DeleteHabitModal.tsx
import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { deleteHabit } from '@/utils/habitFunctions';
import CreateHabitLoader from './CreateHabitLoader';
import { habitIconTypes } from '@/utils/icons';
import HabitIconTypes from './HabitIconTypes';

interface DeleteHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedHabit: number,
    getListOfHabits: Function
}

const DeleteHabitModal: React.FC<DeleteHabitModalProps> = ({ isOpen, onClose, selectedHabit, getListOfHabits }) => {

    const { isOpen: isLoaderOpen, onOpen: onLoaderOpen, onClose: onLoaderClose } = useDisclosure();
    const [loader, setLoader] = useState("");

    const deleteInvHabit = async () => {
        onLoaderOpen();
        setLoader("done");
        await deleteHabit(selectedHabit?.id);
        await delayDone();
    }

    const delayDone = async () => {
        setTimeout(() => {
            onClose();
            onLoaderClose();
            getListOfHabits();
        }, 2000)
    }

    return (
        <>
            <Modal isOpen={isOpen}
                onClose={onClose}
                placement='center'
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
                motionProps={{
                    variants: {
                        enter: {
                            y: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        },
                        exit: {
                            y: -20,
                            opacity: 0,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn",
                            },
                        },
                    }
                }}
            >
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className={`m-auto rounded-full w-[40px] h-[40px] flex items-center justify-center border ${habitIconTypes[selectedHabit?.iconType]?.gradient}`}>
                            <img src={habitIconTypes[selectedHabit.iconType]?.icon} alt="" className='w-[25px] h-[25px]' />
                        </div>
                        <p className="font-semibold text-center">{selectedHabit?.habitName}</p>
                        <p>Are you sure you want to delete the habit?</p>
                    </ModalBody>
                    <ModalFooter>

                        <Button className="bg-button-gradient text-white border-none" onClick={deleteInvHabit}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <CreateHabitLoader loader={loader} isOpen={isLoaderOpen} onClose={onLoaderClose} />

        </>
    );
};

export default DeleteHabitModal;
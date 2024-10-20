import { Modal, ModalContent } from "@nextui-org/react";
import done from '@/utils/animations/done.json'
import error from '@/utils/animations/error.json'
import Lottie from 'react-lottie-player';
import { BounceLoader, ClipLoader, ClockLoader, MoonLoader } from "react-spinners";

interface CreateHabitLoaderProps {
    loader: string;
    isOpen: boolean,
    onClose: () => void
}

const CreateHabitLoader: React.FC<CreateHabitLoaderProps> = ({ loader, isOpen, onClose }) => {

    return (

        <Modal
            isOpen={isOpen}
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
            }}
            placement="center"
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
            onOpenChange={onClose}
            hideCloseButton
        >

            <ModalContent className="bg-transparent shadow-none">
                <>
                    {
                        loader === "loading"
                            ?
                            <ClockLoader
                                color="grey"
                                loading={loader ? true : false}
                                cssOverride={{
                                    display: "block",
                                    margin: "0 auto",
                                }}
                                size={70}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                            :
                            <div className="flex justify-center w-[100%]">
                                <Lottie
                                    loop
                                    animationData={loader === "done" ? done : error}
                                    play
                                    style={{ width: 250, height: 200 }}
                                />
                            </div>
                    }
                </>
            </ModalContent>


        </Modal>

    )
}

export default CreateHabitLoader
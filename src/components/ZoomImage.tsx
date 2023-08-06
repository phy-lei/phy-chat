'use client';
import { FC, Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { RotateCw, RotateCcw } from 'lucide-react';

interface ZoomImageProps {
  src: string;
  alt: string;
}

const ZoomImage: FC<ZoomImageProps> = ({ src, alt }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState(1);
  const [rotate, setRotate] = useState(0);

  const handleScroll = (e: React.WheelEvent) => {
    // 放大
    if (e.deltaY < 0) {
      setCount((count) => count + 1);
    } else {
      // 缩小
      if (count > 1) {
        setCount((count) => count - 1);
      }
    }
  };

  const handleRotate = (flag: string) => {
    if (flag === 'left') {
      setRotate((rotate) => rotate - 90);
    } else {
      setRotate((rotate) => rotate + 90);
    }
  };
  return (
    <>
      <img
        className="cursor-zoom-in"
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
      />
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  style={{ transform: `scale(${count})` }}
                >
                  <Dialog.Title
                    as="div"
                    className="text-xs leading-6 text-gray-900 flex justify-end"
                  >
                    <RotateCcw
                      className="cursor-pointer"
                      onClick={() => handleRotate('left')}
                    ></RotateCcw>
                    <RotateCw
                      className="cursor-pointer"
                      onClick={() => handleRotate('right')}
                    ></RotateCw>
                  </Dialog.Title>
                  <div className="mt-2">
                    <img
                      className="min-w-full min-h-full"
                      src={src}
                      alt={alt}
                      onWheel={(e) => handleScroll(e)}
                      style={{ transform: `rotate(${rotate}deg)` }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ZoomImage;

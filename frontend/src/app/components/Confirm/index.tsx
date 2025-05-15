import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 ${
        isOpen ? "block" : "hidden"
      }` 
    
    }
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Xác nhận</h3>
        <p className="mb-4">{content}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

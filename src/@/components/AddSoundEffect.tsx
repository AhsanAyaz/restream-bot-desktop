import React, { useState } from "react";
import { SoundEffect } from "../../types/SoundEffect";

interface Props {
  onAdd: (effect: SoundEffect) => void;
}

const AddSoundEffect: React.FC<Props> = ({ onAdd }) => {
  const [command, setCommand] = useState("");
  const [modifiers, setModifiers] = useState<string[]>([]);
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEffect: SoundEffect = {
      command,
      hotkey: { modifiers, key },
      description,
      file,
    };
    onAdd(newEffect);
    setCommand("");
    setModifiers([]);
    setKey("");
    setDescription("");
    setFile("");
  };

  const handleFileSelect = async () => {
    const selectedFile = await (window as any).electron.selectFile();
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Command</span>
        </label>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Modifiers</span>
        </label>
        <select
          multiple
          value={modifiers}
          onChange={(e) =>
            setModifiers(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          className="select select-bordered w-full"
        >
          <option value="control">Control</option>
          <option value="alt">Alt</option>
          <option value="shift">Shift</option>
          <option value="meta">Meta</option>
        </select>
      </div>
      <div>
        <label className="label">
          <span className="label-text">Key</span>
        </label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Sound File</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={file}
            onChange={(e) => setFile(e.target.value)}
            className="input input-bordered flex-grow"
            readOnly
          />
          <button type="button" onClick={handleFileSelect} className="btn">
            Select File
          </button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Add Sound Effect
      </button>
    </form>
  );
};

export default AddSoundEffect;

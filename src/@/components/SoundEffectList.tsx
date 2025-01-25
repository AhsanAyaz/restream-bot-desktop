import React from "react";
import { SoundEffect } from "../../types/SoundEffect";

interface Props {
  effects: SoundEffect[];
  onRemove: (index: number) => void;
  handlePlay: (index: number) => void;
}

const SoundEffectList: React.FC<Props> = ({
  effects,
  onRemove,
  handlePlay,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Sound Effects</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Command</th>
            <th>Hotkey</th>
            <th>Description</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {effects.map((effect, index) => (
            <tr key={index}>
              <td>{effect.command}</td>
              <td>
                {effect.hotkey &&
                  `${effect.hotkey?.modifiers.join("+")}+${effect.hotkey?.key}`}
              </td>
              <td>{effect.description}</td>
              <td className="break-all whitespace-pre text-ellipsis overflow-hidden max-w-[40px]">
                {effect.file}
              </td>
              <td>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => onRemove(index)}
                >
                  Remove
                </button>
                <button
                  className="btn btn-sucecss btn-sm"
                  onClick={() => handlePlay(index)}
                >
                  Play
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoundEffectList;

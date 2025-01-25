import React, { useState, useEffect } from "react";
import SoundEffectList from "./SoundEffectList";
import AddSoundEffect from "./AddSoundEffect";
import { SoundEffect } from "../../types/SoundEffect";

function App() {
  const [soundEffects, setSoundEffects] = useState<SoundEffect[]>([]);

  useEffect(() => {
    // Load sound effects from local storage
    const storedEffects = localStorage.getItem("soundEffects");
    if (storedEffects) {
      const parsedStoredEffects = JSON.parse(storedEffects) as SoundEffect[];
      setSoundEffects(parsedStoredEffects);
      console.log({ parsedStoredEffects });
      // register all hotkeys after looping over them
      parsedStoredEffects.forEach(registerEffect);
    }
  }, []);

  const registerEffect = (effect: SoundEffect) => {
    (window as any).electron.registerSoundBoardCommand(JSON.stringify(effect));
  };

  const unRegisterEffect = (effect: SoundEffect) => {
    (window as any).electron.unRegisterSoundBoardCommand(
      JSON.stringify(effect)
    );
  };

  const addSoundEffect = (newEffect: SoundEffect) => {
    const updatedEffects = [...soundEffects, newEffect];
    setSoundEffects(updatedEffects);
    localStorage.setItem("soundEffects", JSON.stringify(updatedEffects));
    registerEffect(newEffect);
  };

  const removeSoundEffect = (index: number) => {
    const effect = soundEffects[index];
    const updatedEffects = soundEffects.filter((_, i) => i !== index);
    setSoundEffects(updatedEffects);
    localStorage.setItem("soundEffects", JSON.stringify(updatedEffects));
    unRegisterEffect(effect);
  };

  const playSoundEffect = async (index: number) => {
    const effect = soundEffects[index];
    if (!effect) {
      return;
    }
    const result = await (window as any).electron.executeCommand(
      effect.command
    );
    console.log({ result });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Soundboard App</h1>
      <AddSoundEffect onAdd={addSoundEffect} />
      <SoundEffectList
        effects={soundEffects}
        onRemove={removeSoundEffect}
        handlePlay={playSoundEffect}
      />
    </div>
  );
}

export default App;

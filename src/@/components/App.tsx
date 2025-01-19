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
      setSoundEffects(JSON.parse(storedEffects));
    }
    console.log({ storedEffects });
    // register all hotkeys after looping over them
  }, []);

  const addSoundEffect = (newEffect: SoundEffect) => {
    const updatedEffects = [...soundEffects, newEffect];
    setSoundEffects(updatedEffects);
    localStorage.setItem("soundEffects", JSON.stringify(updatedEffects));
    // register the hotkey
  };

  const removeSoundEffect = (index: number) => {
    const updatedEffects = soundEffects.filter((_, i) => i !== index);
    setSoundEffects(updatedEffects);
    localStorage.setItem("soundEffects", JSON.stringify(updatedEffects));
    // unregister the hotkey
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Soundboard App</h1>
      <AddSoundEffect onAdd={addSoundEffect} />
      <SoundEffectList effects={soundEffects} onRemove={removeSoundEffect} />
    </div>
  );
}

export default App;

import { useState } from "react";

import { IntegerField } from "@forthtilliath/react-native-kit/components/form/IntegerField";
import { TextField } from "@forthtilliath/react-native-kit/components/form/TextField";

import { DemoFrame } from "../DemoFrame";
import { app, themed } from "../palette";

const appColors = {
  text: app.text,
  label: app.text,
  placeholder: app.muted,
  background: app.card,
  border: app.control,
  borderFocused: app.primary,
  error: app.danger,
};

function Fields({ colors }: { colors?: typeof appColors }) {
  const [name, setName] = useState("Marie");
  const [points, setPoints] = useState(-12);
  return (
    <>
      <TextField
        label="Nom du joueur"
        value={name}
        onChangeText={setName}
        hint="30 caractères maximum"
        maxLength={30}
        required
        colors={colors}
      />
      <TextField
        label="Code du groupe"
        value="ABC"
        error="Ce code n'existe pas."
        colors={colors}
      />
      <IntegerField
        label="Points de merveille (négatif possible)"
        value={points}
        onChange={setPoints}
        min={-30}
        max={99}
        colors={colors}
      />
      <TextField
        label="Recherche"
        placeholder="Un jeu, un auteur…"
        colors={colors}
      />
    </>
  );
}

export function TextFieldDemo() {
  return (
    <DemoFrame>
      {(panel) => <Fields colors={themed(panel, appColors)} />}
    </DemoFrame>
  );
}

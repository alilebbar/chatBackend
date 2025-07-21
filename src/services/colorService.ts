
import Message from "../models/message";

export const colorGenerate = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const colorUnique = async (color: string): Promise<string> => {
  try {
    const message = await Message.findOne({ sender: color });
    if (message) return await colorUnique(colorGenerate());
    return color;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de la couleur :", error);
    return colorGenerate();
  }
};

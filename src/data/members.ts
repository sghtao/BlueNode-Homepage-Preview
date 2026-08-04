export type Member = {
  handle: string;
  displayName: string;
  aliases: string[];
  links?: {
    medium?: string;
  };
};

export const members: Member[] = [
  {
    handle: "wonpil",
    displayName: "wonpil",
    aliases: ["Wonpil"],
  },
  {
    handle: "jiho",
    displayName: "JIHO_BlueNode",
    aliases: ["JIHO", "jiho_bluenode"],
  },
  {
    handle: "jaewon",
    displayName: "Jaewon_BlueNode",
    aliases: ["Jaewon_", "jaewon"],
  },
  {
    handle: "uksang",
    displayName: "Uksang_BlueNode",
    aliases: ["Uksang_", "uksang"],
  },
  {
    handle: "hangil",
    displayName: "Hangil Lee",
    aliases: ["Hangil", "hangil lee"],
  },
];

const membersByHandle = new Map(members.map((member) => [member.handle, member]));

export function getMembersByHandles(handles: string[]): Member[] {
  return handles.map((handle) => {
    const member = membersByHandle.get(handle);

    if (!member) {
      throw new Error(`Unknown research author handle: ${handle}`);
    }

    return member;
  });
}

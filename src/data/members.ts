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
  {
    handle: "arkstar",
    displayName: "arkstar",
    aliases: ["0xarkstar"],
    links: {
      medium: "https://medium.com/@0xarkstar",
    },
  },
  {
    handle: "seungzookim",
    displayName: "김승주",
    aliases: ["Seungzookim", "seungzookim"],
    links: {
      medium: "https://medium.com/@seungzookim",
    },
  },
  {
    handle: "yusemin",
    displayName: "유세민",
    aliases: ["Yusemin", "yusemin"],
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

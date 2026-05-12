import type { NPC } from "@/types"

// ============================================================
// DEATH'S SEVEN — NPC & CREATURE DATABASE
// Allies, enemies, neutral parties, bosses, and creatures
// ============================================================

export const npcs: NPC[] = [

  // ============================================================
  // PARTY ALLIES & KEY RECURRING NPCS
  // ============================================================

  {
    id: 'fizzle',
    name: 'Fizzle',
    race: 'Pixie',
    role: "Nyx's Messenger / Party Guide",
    status: 'Active',
    alignment: 'Ally',
    location: 'With the Party',
    arc: 'All',
    description: "A small, chaotic, deeply sincere pixie who has been with the party since they woke up in a field outside Janus being chased by goblins. Nyx's official messenger and the party's guide — though she admits she ended up following them instead of guiding them.",
    personality: "Cheerful, occasionally dramatic, genuinely caring. Covers distress with chatter. Falls asleep mid-sentence when exhausted. Cannot enter the Aspirant's mountain.",
    notes: [
      "Knew the shape of Nyx's plan from the beginning but not all the details",
      "Cannot enter the Aspirant's mountain in Ch.19 — this is her as-far-as-she-goes moment",
      "Her send-off speech at the mountain base: she practiced one with three points and a conclusion. Forgot all of it when she got there",
      "'Don't die. That's the speech.'",
      "Waits on Nyx's section of the mountain during the trials. Is there when they descend.",
      "Final line of the campaign belongs to her: 'Good morning. What do you want to do today?'",
      "Has a collection of blink pups she is extremely attached to",
      'Stat block source: docs/NPCs/fizzle.md',
    ],
    firstAppearance: 1,
    statBlock: {
      name: 'Fizzle',
      cr: '1/4',
      ac: 15,
      hp: '20 (8d4)',
      speed: '10ft, fly 40ft',
      str: 2, dex: 20, con: 8, int: 10, wis: 14, cha: 15,
      skills: ['Perception +4', 'Stealth +5'],
      senses: 'Passive Perception 14',
      languages: 'Common, Sylvan',
      image: '/images/fizzle.png',
      traits: [
        {
          name: 'Innate Spellcasting',
          description: [
            "The pixie's innate spellcasting ability is Charisma (spell save DC 12). It can innately cast the following spells, requiring only its pixie dust as a component:",
            'At will: druidcraft.',
            '1/day each: confusion, dancing lights, detect evil and good, detect thoughts, dispel magic, entangle, fly, phantasmal force, polymorph, sleep.',
          ],
        },
        { name: 'Magic Resistance', description: 'Fizzle has advantage on saving throws against spells and other magical effects.' },
      ],
      actions: [
        { name: 'Superior Invisibility', description: 'As an action, Fizzle magically turns invisible until its concentration ends (as if concentrating on a spell). Any equipment the pixie wears or carries is invisible with it.' },
      ],
    },
    tags: ['ally', 'nyx', 'guide', 'recurring', 'comic relief'],
  },

  {
    id: 'leocraes',
    name: 'Prince Leocraes',
    race: 'Half-Elf',
    role: 'Crown Prince of Nova Clarus / Nova Sentinels Founder',
    status: 'Active',
    alignment: 'Ally',
    location: 'Nova Clarus',
    arc: 'All',
    description: "The Crown Prince of Nova Clarus and secret founder of the Nova Sentinels. Right about his father being replaced — but was protecting himself from knowing too much, until the Summer Estate. Carries his father's letter.",
    personality: "Composed, loyal, privately frightened. Does not fill silences. Lets him win at sparring until age twelve then stopped.",
    notes: [
      "Father (King Kaelen) was replaced by Pride doppelganger over a year before Ch.16",
      "The real King wrote a letter and hid it — Leo found it after the Summer Estate ambush",
      "Critically injured in Ch.15 Summer Estate ambush — survival uncertain for one session",
      "His 'Come back. All of you. That is not a request.' is the farewell before Act III",
      "Does not put the crown on the night Pride falls — asks Nazura to hold it",
      "Holds Nova Clarus while the party faces the Aspirant",
      "AC 14, HP 52, Noble/Sentinel officer stats if needed in combat",
    ],
    firstAppearance: 2,
    tags: ['ally', 'nova clarus', 'recurring', 'royalty'],
  },

  {
    id: 'nazura',
    name: 'Commander Nazura',
    race: 'Half-Orc',
    role: 'Nova Sentinels Commander',
    status: 'Active',
    alignment: 'Ally',
    location: 'Nova Clarus — Sentinel HQ',
    arc: 'All',
    description: "The commanding officer of the Nova Sentinels. One of three people who knew the truth about the party's mission from the beginning. Steady, precise, gives bad news in a flat voice and then asks what you need.",
    personality: "Unflappable. Tactical. Finds each party member individually before they leave for the mountain. Does not make speeches.",
    notes: [
      "One of three original Sentinels who knew the party's true nature as Nyx's chosen",
      "Announces the Pride doppelganger's exposure to Nova Clarus — not Leocraes, not the party. Nazura.",
      "Wears off-duty clothes to the farewell gathering — somehow more formal than her uniform",
      "Rallies Sentinel backing for Leocraes in Ch.16 Stage 1 operation",
    ],
    firstAppearance: 2,
    tags: ['ally', 'nova clarus', 'sentinels', 'recurring'],
  },

  {
    id: 'thraggin',
    name: 'Thraggin',
    race: 'Dwarf',
    role: 'Sentinel R&D / Artificer',
    status: 'Active',
    alignment: 'Ally',
    location: 'Nova Clarus — University',
    arc: 'All',
    description: "The Sentinel R&D artificer who identified the Relic Stone and sent the party to Darkon. Invented the Soul Siphon Modules. Discovers the receiver address in Ch.17 after an all-night analysis session.",
    personality: "Precise, self-critical, intensely focused. Sets things down carefully. Has been building something for each party member for weeks.",
    notes: [
      "Identified the Relic Stone in Ch.2 — sent party to Darkon to learn how to use it",
      "Built the Soul Siphon Modules — the instrument of the Aspirant's collection, unknowingly",
      "'Don't let me study the True Reapers. We don't have time and I will not be able to stop.'",
      "All-night analysis in Ch.17 reveals the receiver address and the Aspirant's two-stone design",
      "Gives each party member a small object before they leave for the mountain. No explanation.",
      "Crystal spark invention: sets off from the university roof at every possible opportunity",
    ],
    firstAppearance: 2,
    tags: ['ally', 'nova clarus', 'artificer', 'recurring'],
  },

  {
    id: 'valerius',
    name: 'Director Elara Valerius',
    race: 'Human',
    role: 'Scion Directorate / Azure Piercer Commander',
    status: 'Active',
    alignment: 'Neutral',
    location: 'Nova Clarus',
    arc: 'Act I',
    description: "Director of the Scion Directorate and commander of the Azure Piercer. Pragmatic, resource-focused. Helped the party escape Darkon aboard the Piercer.",
    personality: "Efficient. Dislikes unclear objectives. Will help if it serves the Directorate's interests.",
    notes: [
      "Sends the Azure Piercer remotely in Ch.17 — Manikin pilot, no Valerius aboard",
      "The Piercer is trackable which is why the party takes the Platypus to the Stillwater in Ch.18",
    ],
    firstAppearance: 5,
    tags: ['neutral', 'scion directorate', 'azure piercer'],
  },

  // ============================================================
  // CHAPTER-SPECIFIC ALLIES
  // ============================================================

  {
    id: 'corra',
    name: 'Corra',
    race: 'Human',
    role: 'Casa Ornasca Resistance Leader',
    status: 'Active',
    alignment: 'Ally',
    location: 'Gildmaw (The Fold)',
    arc: 'Ch.9 — Greed',
    description: "A former merchant of Casa Ornasca who now leads a small resistance cell from a hidden basement in the Fold. Lost everything in the usurpation. Has been waiting for something to change.",
    personality: "Tough. Briefly not tough. Then tough again. Does not weep dramatically.",
    notes: [
      "Recognizes Rolando by his speech cadence — not his face, his vocabulary and sentence structure",
      "'You speak like him. You speak exactly like the prince.'",
      "When she weeps it is quiet, turned away, composed before she turns back",
      "Resistance is ~30 people — survivors, not fighters",
      "Moves her people into Gildmaw immediately when the Sin falls",
      "Came to Nova Clarus for the party's return at the end — no explanation given, none needed",
    ],
    firstAppearance: 9,
    tags: ['ally', 'gildmaw', 'casa ornasca', 'resistance'],
  },

  {
    id: 'pell',
    name: 'Pell',
    race: 'Half-Elf',
    role: 'Former Platypus Crew / Dock Worker',
    status: 'Active',
    alignment: 'Ally',
    location: 'Gildmaw — Peridot Platypus',
    arc: 'Ch.9 — Greed',
    description: "A former crew member of the Peridot Platypus who stayed on under Avarus's flag because he had nowhere else to go. Has kept the ship ready since the Sin fell. Came with her to Nova Clarus.",
    personality: "Weathered. Ashamed. Reliable. Still calls Michael 'Captain'.",
    notes: [
      "Recognizes Michael not by appearance but by the way he moves on a ship",
      "His 'Captain?' is the mirror of Corra's speech recognition — finding the same soul in a new vessel",
      "Knows: bribeable guards, dealer skimming ops, and the service tunnel from Platypus to Gilded Cage",
      "Stays behind at the ship in Ch.9 Session 3 — 'he has done enough'",
      "Sails the Platypus to Nova Clarus for the party's return",
    ],
    firstAppearance: 9,
    tags: ['ally', 'gildmaw', 'peridot platypus'],
  },

  {
    id: 'sera-vane',
    name: 'Commander Sera Vane',
    race: 'Human',
    role: 'Refugee Camp Commander',
    status: 'Active',
    alignment: 'Ally',
    location: 'Outside Mount Vorrath',
    arc: 'Ch.14 — Wrath',
    description: "A refugee commander who has been organizing survivors from Draven's conquered cities for two years. Lost eleven scouts getting maps of the volcano's exterior. Gives the maps freely.",
    personality: "Asks that they make it count. Does not ask for anything else.",
    notes: [
      "Lost eleven scouts to get the volcano maps. Gives them without hesitation.",
      "Waiting at the mountain's base when the party descends — sees the army stand down and nods once",
      "That nod is the whole scene",
    ],
    firstAppearance: 14,
    tags: ['ally', 'wrath arc', 'mount vorrath'],
  },

  {
    id: 'oswin',
    name: 'Oswin',
    race: 'Human',
    role: 'Clockmaker / Pip\'s Father',
    status: 'Active',
    alignment: 'Ally',
    location: 'Somnara',
    arc: 'Ch.12 — Sloth',
    description: "A clockmaker in Somnara who tended to his sleeping son and the sleeping city for months. The last waking resident until three days before the party arrived. His workshop is still warm.",
    personality: "Documented everything. Cultivated Dreamleaf Tea knowing someone would eventually come. Could not save his son himself.",
    notes: [
      "Journal documents: Pip's gifts, the bullying, the depression, the sleep, the vines",
      "Last entry (deteriorating handwriting): 'I could not fix it. I tried. I could not fix it.'",
      "Cultivated Dreamleaf Tea for exactly this purpose — the door for whoever could save Pip",
      "Falls asleep himself three days before party arrives. Wakes when the vines wither.",
    ],
    firstAppearance: 12,
    tags: ['ally', 'somnara', 'sloth arc'],
  },

  {
    id: 'pip',
    name: 'Pip',
    race: 'Human',
    role: 'Child Prodigy / Thorny\'s Believer',
    status: 'Active',
    alignment: 'Ally',
    location: 'Somnara',
    arc: 'Ch.12 — Sloth',
    description: "A ten-year-old prodigy who was told his gifts meant nothing. His depression opened the door for the Sin of Sloth. His belief in Thorny McMugface contributed to Thorny's soul becoming real. Was asleep for months.",
    personality: "Still building things even in the nightmare loop. That is who Pip is.",
    notes: [
      "Could hear music in mathematical sequences. Saw structural poetry in bridge architecture.",
      "Told by teachers and classmates his gifts were not gifts. Believed them eventually.",
      "His one comfort was Thorny McMugface chapbooks — got bullied for believing Thorny was real",
      "Still building something small and careful in the nightmare loop when Thorny finds him",
      "Gives his worn chapbook to Salvatore — for Thorny — without a word",
      "Comes to Nova Clarus for the party's return. Small, ten, holding the more-worn chapbook.",
      "Cannot fight in the Sloth boss encounter — can point at corrupted elements to reclaim them",
    ],
    firstAppearance: 12,
    tags: ['ally', 'somnara', 'sloth arc', 'thorny'],
  },

  {
    id: 'edric',
    name: 'Lord Edric',
    race: 'Human',
    role: 'Sovereign Lord\'s Heir / Cobbler',
    status: 'Active',
    alignment: 'Ally',
    location: 'Glass Spire (hiding)',
    arc: 'Ch.13 — Envy',
    description: "The sovereign lord's heir, fifteen when his parent was killed by Argente-Envy. Has been living as a cobbler in the Glass Spire's poorest district for a decade. Has been documenting everything.",
    personality: "Decided not to run when he saw the party coming. Has been waiting for someone to tell.",
    notes: [
      "Hands have cobbler's calluses but posture remembers the palace",
      "Does not want his title back — wants Cassius Argente freed from the Sin he inherited",
      "Has fifteen years of documentation: Argente-Envy connection, mask decree's true purpose",
      "Sits down next to Cassius on the floor after the fight. They don't speak for a while.",
      "'I could not find the occasion.' — on the bottle Leocraes keeps for important celebrations",
    ],
    firstAppearance: 13,
    tags: ['ally', 'glass spire', 'envy arc'],
  },

  {
    id: 'pellwick',
    name: 'Pellwick',
    race: 'Gnome',
    role: 'University Archivist',
    status: 'Active',
    alignment: 'Ally',
    location: 'Nova Clarus University',
    arc: 'Ch.18 — True Reapers',
    description: "An elderly gnome archivist who has been cataloguing the university's restricted wing for forty years. Has been waiting for someone with clearance to ask about the True Reapers.",
    personality: "Delighted. Was already pulling volumes before they finished explaining what they needed.",
    notes: [
      "Has had the Stillwater coordinates for forty years. Was waiting for someone to need them.",
      "'I wondered when someone would finally ask.'",
      "Knows the full prophecy cycle — the Sins, the binding weakening, the chosen proxies",
    ],
    firstAppearance: 18,
    tags: ['ally', 'nova clarus', 'true reapers arc'],
  },

  // ============================================================
  // SIN HOSTS
  // ============================================================

  {
    id: 'avarus',
    name: 'Baron Avarus',
    race: 'Human (formerly)',
    role: 'Host — Sin of Greed / Lord of Gildmaw',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Gildmaw — The Gilded Cage Penthouse',
    arc: 'Ch.9 — Greed',
    description: "A tall, theatrical figure in an immaculate fur-trimmed coat of deep crimson and gold. Crystal-topped cane pulsing with sickly light. His skin moves — slow lazy ripples of liquid gold circulating just beneath the surface.",
    personality: "Performative excess with genuine self-awareness underneath it. Knows exactly what he is. Chose it. Was afraid of going back to nothing.",
    notes: [
      "Backstory: born a beggar during the fall of Casa Ornasca. A soldier gave him a coin and told him to run. He has thought about that coin every day since.",
      "The soldier may have been one of Rolando's men. The party can piece this together.",
      "SOUL SIPHON EFFECT: Each hit cracks the gold surface, sends coins exploding outward. Dissolve to dust before hitting floor. Final Siphon: whole surface erupts — slot machine jackpot of dissolving gold. Then just a man.",
      "Post-Siphon: sitting on the floor, looking at his hands. 'I remember being cold. I had forgotten that.'",
      "Party decides his fate — no right answer. Corra and the resistance are the suggested destination.",
    ],
    firstAppearance: 9,
    statBlock: {
      name: 'Baron Avarus, Sin of Greed',
      cr: '13',
      ac: 18,
      hp: 180,
      speed: '30ft',
      str: 16, dex: 14, con: 18, int: 16, wis: 12, cha: 20,
      traits: [
        { name: 'Liquid Gold Armor', description: 'AC 18 from gold skin. Each Soul Siphon hit cracks it — gold coins explode outward, dissolving to dust. Final hit erupts the whole surface.' },
      ],
      actions: [
        { name: 'Crystal Cane', description: '+9 to hit, 2d8+5 bludgeoning + 1d6 necrotic (soul drain).' },
        { name: 'Liquidate Assets (Bonus Action)', description: 'Consumes a nearby chip pile to heal 3d10 HP. Destroying piles before/during combat removes this option.' },
      ],
      legendaryActions: [
        { name: 'Debt Collection (Recharge 5-6)', description: 'Target DC 16 CON save or gains 1 Soul Debt mark and Avarus heals 20 HP.' },
      ],
    },
    tags: ['boss', 'sin host', 'greed', 'gildmaw'],
  },

  {
    id: 'the-matriarch',
    name: 'The Matriarch',
    race: 'Unknown (recently consumed host)',
    role: 'Host — Sin of Lust',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Veilmoor — Palace of Sighs',
    arc: 'Ch.10 — Lust',
    description: "Beneath the diamond mask: not a rotting face but a void. Pale perfect skin stretched over something that is not quite a face. A mouth full of needles arranged into a smile. Eyes that reflect the room back rather than looking out. Her host is Seraphel — a grieving widow consumed recently enough that the city still remembers who she was.",
    personality: "Craves adoration. Coldest person in the room. Cannot categorize Thornvatore and will not target him with Charm of Vanity.",
    notes: [
      "Host is Seraphel — a recently consumed widow who came to Veilmoor seeking comfort after losing her husband. The Sin found the door through her grief.",
      "The priestess of Nyx is alive in Veilmoor as a separate person — she is Neutral Good and would not willingly serve the Sin of Lust.",
      "Charm of Vanity CANNOT target Thornvatore — the Sin cannot categorize his desire to be real. This immunity carries into the Aspirant fight.",
      "Post-Siphon: Seraphel is shivering on the ballroom floor, not knowing where she is. Party decides what happens next.",
    ],
    firstAppearance: 10,
    statBlock: {
      name: 'The Matriarch, Sin of Lust',
      cr: '14',
      ac: 17,
      hp: 200,
      speed: '30ft, fly 40ft',
      str: 14, dex: 18, con: 16, int: 16, wis: 12, cha: 22,
      traits: [
        { name: 'Chilling Presence Aura', description: 'Scaled cold damage to all within 10ft at start of each turn.' },
      ],
      actions: [
        { name: 'Vampiric Kiss (Grapple)', description: 'On hit, drains HP and heals the Matriarch for the same amount.' },
        { name: 'Charm of Vanity (Recharge 5-6)', description: 'Target makes scaled WIS save or sees Matriarch as their Perfect Self — uses Reaction to protect her from next attack. CANNOT target Thornvatore.' },
      ],
    },
    tags: ['boss', 'sin host', 'lust', 'veilmoor'],
  },

  {
    id: 'aldric-voss',
    name: 'Aldric Voss',
    race: 'Human (transformed)',
    role: 'Host — Sin of Gluttony / THE MAW',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Outside Gula — IS The Maw',
    arc: 'Ch.11 — Gluttony',
    description: "Magistrate Aldric Voss made a deal to end his city's famine. The Sin entered him and never left. He is not inside The Maw — he IS The Maw. His limbs became the walls. His stomach became the digestive core. The city of Gula was consumed by the man who was supposed to protect it.",
    personality: "Still conscious. Still remorseful. Cannot speak — mouth fused shut by tissue. Eyes track the party with unmistakable grief.",
    notes: [
      "Made the deal fifty years ago. Has been The Maw ever since.",
      "The party has been walking through him since they entered his mouth.",
      "In the digestive core: suspended in the air, arms and legs fused into the chamber walls, torso the origin of every tissue cord.",
      "Flexes his fused arms to suppress Peristalsis for 3 rounds — tears himself apart to do it. Does it anyway.",
      "The Soul Siphon frees him. His hands become his hands again. He closes them into fists. Opens them. Lets go.",
      "Does not come out. He was The Maw. When The Maw is gone, Aldric is gone.",
      "Deal documents found in the rib maze office, signed. His final note at the bottom: 'I should not have done this. — A.'",
      "Sera (survivor) receives the documents and note. 'He knew. At the end he knew.'",
    ],
    firstAppearance: 11,
    statBlock: {
      name: 'The Digestive Core (Aldric Voss / The Maw)',
      cr: '15',
      ac: 14,
      hp: 220,
      speed: 'Immobile (environmental boss)',
      str: 24, dex: 8, con: 22, int: 6, wis: 6, cha: 4,
      traits: [
        { name: 'Environmental Boss', description: 'The Sin inhabits the digestive core of The Maw. HP represents structural integrity, not a health bar. At 0 HP the chamber collapses and the Soul Siphon can reach the Sin.' },
        { name: "Aldric's Hold", description: 'Once per combat, Aldric suppresses Peristalsis for 3 rounds by flexing his fused arms. This costs him everything.' },
      ],
      actions: [
        { name: 'Acid Surge (Lair Action, Init 20)', description: 'One acid pool expands 10ft in every direction. DC (scaled) DEX save or scaled acid damage.' },
        { name: 'Tissue Tendril', description: '+scaled to hit, reach 20ft, scaled bludgeoning + grapple. Grappled targets pulled toward nearest acid pool each turn.' },
        { name: 'Absorption (Recharge 5-6)', description: 'Grappled target DC (scaled) CON save or partially absorbed — Restrained, scaled acid damage/round until freed.' },
      ],
    },
    tags: ['boss', 'sin host', 'gluttony', 'gula'],
  },

  {
    id: 'pip-sloth',
    name: 'The Sleeper (Pip)',
    race: 'Human (child)',
    role: 'Host — Sin of Sloth',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Somnara — Dreamscape',
    arc: 'Ch.12 — Sloth',
    description: "The Sin of Sloth inhabited Pip through his depression. The Sleeper manifests in the dreamscape as a vast, slow, patient figure woven from grey mist, seated on a throne that looks like a bed. The host — Pip — is in a nightmare loop of the bullying that broke him.",
    personality: "Speaks at half speed. Every syllable its own small gravity. Creates involuntary stillness.",
    notes: [
      "Pip's nightmare loop: a grey classroom, the specific words, on repeat. He is still building something even there.",
      "Thorny enters the loop. The words don't touch him. He sits next to Pip and says 'That's brilliant.' The loop stutters.",
      "Pip: 'You're not real.' Thorny: 'I wasn't. I am now.'",
      "Defeating the Sleeper without any deaths = the trial is complete. Resets with 'Again.' on death.",
      "Thorny's presence creates a 10ft anchor radius free of the Aura of Stillness",
    ],
    firstAppearance: 12,
    statBlock: {
      name: 'The Sleeper, Sin of Sloth',
      cr: '14',
      ac: 16,
      hp: 190,
      speed: '20ft (all movement halved in aura)',
      str: 10, dex: 8, con: 18, int: 14, wis: 20, cha: 16,
      traits: [
        { name: 'Aura of Lethargy', description: 'Entire arena is Difficult Terrain. No Reactions within 30ft of the Sleeper.' },
        { name: "Thorny's Anchor", description: "Thorny's presence (even inside Salvatore) creates a 10ft radius where the Aura of Stillness does not apply." },
      ],
      actions: [
        { name: 'Deep Sleep (Recharge 5-6)', description: 'Target DC (scaled) WIS save or Banished to personal nightmare loop until they succeed on a DC (scaled) WIS save at start of each turn, or ally uses action to call them back.' },
        { name: 'Gravity Shift (Lair Action, Init 20)', description: 'DC (scaled) WIS save or fall sideways — 20ft random horizontal, Prone, 2d6 psychic.' },
      ],
    },
    tags: ['boss', 'sin host', 'sloth', 'somnara', 'dreamscape'],
  },

  {
    id: 'cassius-argente',
    name: 'Lord Cassius Argente',
    race: 'Human',
    role: 'Host — Sin of Envy / Head of House Argente',
    status: 'Active',
    alignment: 'Complex',
    location: 'Glass Spire — Argente Palace',
    arc: 'Ch.13 — Envy',
    description: "Young — mid-twenties. Brilliant, controlled, and deeply uncomfortable in his own skin. Inherited the Sin of Envy from his parent along with the house leadership. Has been fighting it for ten years and losing.",
    personality: "Performing control rather than having it. Afraid of himself, not the party.",
    notes: [
      "His parent made the deal with Envy to destroy the Sovereign Lord. Cassius was fourteen when it happened.",
      "Sets his house mask face-down on the floor when he speaks to the party. First time without it.",
      "'Tell me how.' — asking Salvatore how to say no to yourself.",
      "Once per round in the Envy fight: names a stolen ability back to its owner. His act of choosing his own identity.",
      "By the end of the fight he should look like someone who has been underwater for a decade and has just surfaced.",
      "'I killed your parent.' — said directly to Edric, not for the party's benefit.",
    ],
    firstAppearance: 13,
    tags: ['complex', 'sin host', 'envy', 'glass spire', 'house argente'],
  },

  {
    id: 'general-draven',
    name: 'General Draven',
    race: 'Human',
    role: 'Host — Sin of Wrath / Military Commander',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Mount Vorrath',
    arc: 'Ch.14 — Wrath',
    description: "Born the third son of a minor noble family. Rose through military ranks faster than anyone in a generation. Passed over for Field Marshal three times — the third for a man he personally trained. The rage was always there. The Sin found a door that had been unlocked for twenty years.",
    personality: "Silent after the helmet comes off. Does not monologue. Prepared the antechamber hot spring for the party. Wants the fight to mean something.",
    notes: [
      "Draven is NOT irredeemable BECAUSE of the Sin — he was already this. The Sin made him better at it.",
      "DRAZIER CONNECTION: Draven is the BBEG who killed Drazier in his past life. Wrath recognition triggers when helmet comes off (or earlier if Drazier failed Lust mask check in Ch.10)",
      "He knows who the party is. He remembers the level 3 recruits from Ch.1.",
      "'I remember you. From the village. You were level three. You are not level three anymore.'",
      "Prepared antechamber hot spring: wants them rested. Wants the fight fair. More terrifying than any trap.",
      "POST-SIPHON: Keeps fighting. 3-4 rounds. No rage enhancement. Just the man who was already doing this.",
      "'Did you think that was the part that made me dangerous?'",
      "Does not ask for quarter. Does not offer surrender. Does not explain himself.",
      "Falls face-down on the throne room floor with the horizon visible through the open wall.",
    ],
    firstAppearance: 1,
    statBlock: {
      name: 'General Draven, Sin of Wrath',
      cr: '20',
      ac: 22,
      hp: 350,
      speed: '40ft',
      str: 24, dex: 16, con: 22, int: 18, wis: 16, cha: 14,
      traits: [
        { name: 'Wrath Aura', description: 'All attacks deal +2d6 fire damage. Creatures starting turn within 10ft take 1d6 fire.' },
        { name: 'Tactical Mastery', description: 'Cannot be surprised. Advantage on initiative. If wins initiative: two attacks before any party member acts.' },
        { name: 'Relentless (3/day)', description: 'When reduced to 0 HP, drops to 1 HP instead.' },
        { name: 'Iron Collar (if not destroyed in Tier 1)', description: 'Once per combat, suppresses one Soul Siphon Module for 3 rounds.' },
      ],
      legendaryActions: [
        { name: 'Attack', description: 'One weapon attack.' },
        { name: 'Press', description: 'Move up to half speed without provoking opportunity attacks.' },
        { name: 'Break', description: 'DC (scaled) STR save or target knocked Prone and pushed 15ft.' },
      ],
      legendaryResistances: 3,
    },
    tags: ['boss', 'sin host', 'wrath', 'mount vorrath'],
  },

  {
    id: 'king-kaelen',
    name: 'King Kaelen (Doppelganger)',
    race: 'Doppelganger (Pride)',
    role: 'Host — Sin of Pride / King of Nova Clarus',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Nova Clarus — Royal Palace',
    arc: 'Ch.16 — Pride',
    description: "The Sin of Pride has been wearing King Kaelen's face for over a year. The real King knew he was replaced and wrote a letter hidden in his private study. The real King has been dead for over a year.",
    personality: "The performance is immaculate. 'Did she make it?' — genuine grief performance at the Summer Estate. Does not drop the face until the Soul Siphon hits.",
    notes: [
      "The real King Kaelen wrote: 'Whatever is on the throne is not me. Do not mourn it.'",
      "Directed party to every Sin hunt — used them to eliminate economic and military competition",
      "'Recovered assets' — how the commendation after Gluttony referred to Gula's residents",
      "Maintains King's Face (AC +2) throughout the fight — too vain to drop the disguise",
      "Leocraes's call-outs: AC negation + one Mirror Image destroyed per call-out",
      "Post-Siphon: featureless gray thing on the floor. Small. The crown rolls and stops against the throne base.",
    ],
    firstAppearance: 2,
    statBlock: {
      name: 'The Sin of Pride — Doppelganger King',
      cr: '16',
      ac: 18,
      hp: 240,
      speed: '30ft',
      str: 14, dex: 16, con: 18, int: 20, wis: 16, cha: 22,
      traits: [
        { name: "King's Face", description: 'Maintains King Kaelen appearance. AC is 20 while disguise holds. Leocraes can negate this once per round as free action.' },
      ],
      actions: [
        { name: 'Studied Weakness (Legendary)', description: 'Exploits known party weakness — DC 20 WIS save or suffer prepared effect.' },
        { name: 'Mirror Image (3/day)', description: '3 illusory duplicates, AC 10 each.' },
        { name: 'Perfect Imitation (Recharge 5-6)', description: 'Takes exact form of one party member. Target DC (scaled) CHA save or Incapacitated 1 round.' },
      ],
    },
    tags: ['boss', 'sin host', 'pride', 'nova clarus', 'doppelganger'],
  },

  // ============================================================
  // THE ASPIRANT
  // ============================================================

  {
    id: 'the-aspirant',
    name: 'The Aspirant',
    race: 'Human',
    role: 'Main Villain / The Beggar',
    status: 'Active',
    alignment: 'Enemy',
    location: 'The Summit Mountain',
    arc: 'All (revealed Ch.17)',
    description: "The man in Cell 6 of the Mountain Dungeon. The pathetic informant. The beggar who said 'Now go! And give that monster general hell for me.' He has been here the whole time. He designed their deaths. He designed their rebirths. He made two Relic Stones, implanted one in his own chest, and used the party to fill him with all seven Sins over the entire campaign.",
    personality: "Eleven years of patient planning. Genuinely curious about the party. Will answer questions honestly before the final fight — he has nothing to hide. 'I built you to.' The board in the lab could not draw Thorny. 'CANNOT CONFIRM VISUAL.'",
    notes: [
      "Freed the Sins through a legalistic loophole — Nyx was tricked but also anticipated this (prophecy cycle)",
      "Made TWO Relic Stones: REAPER (party's) and COLLECTOR (in his chest). Soul Siphons inherited the Reaper function.",
      "Surgical table with cut restraints — he restrained himself for the implantation, cut himself free after. Alone.",
      "The board in the lab: red string connecting every reincarnation of every party member. Thorny's column has five crossed-out drawings and 'CANNOT CONFIRM VISUAL'",
      "Watched Salvatore in Calimore — was considering him as a proxy even then",
      "'The legend was unexpected. He is the only thing in eleven years of planning I did not account for.'",
      "PHASE 1: Mortal tactician, 3 pre-prepared contingency spells, Studied Variable per known weakness",
      "PHASE 2: Sin-empowered, all 7 Sin abilities cycle, appearance shifts per Sin used",
      "PHASE 3: Near-divine, Ascension Clock of 5 turns, True Reapers are the key",
      "DEFEAT: Nyx claims him. The sky changes. He is simply taken. 'Ah. There it is.'",
      "'Closer than I expected you to cut it.' — final words",
    ],
    firstAppearance: 1,
    statBlock: {
      name: 'The Aspirant — Phase 1 (Mortal)',
      cr: '22',
      ac: 20,
      hp: 250,
      speed: '35ft',
      str: 16, dex: 18, con: 20, int: 24, wis: 18, cha: 20,
      traits: [
        { name: 'Contingency Protocol', description: '3 pre-prepared spells (Counterspell, Shield, Mislead) trigger automatically when relevant condition occurs.' },
        { name: 'Studied Variable (Bonus Action)', description: 'Once per round, exploits a specific known weakness of a target. DC 20 save or suffer prepared effect.' },
      ],
      actions: [
        { name: 'Phase Transition at 125 HP', description: 'Relic Stone cracks. Seven Sins begin manifesting externally. Phase 2 begins immediately.' },
      ],
    },
    tags: ['boss', 'main villain', 'aspirant', 'act 3'],
  },

  // ============================================================
  // MINOR NPCS
  // ============================================================

  {
    id: 'vorian',
    name: 'Captain Vorian (Doppelganger)',
    race: 'Doppelganger',
    role: 'Royal Guard Captain (replaced)',
    status: 'Deceased',
    alignment: 'Enemy',
    location: 'Old Summer Estate',
    arc: 'Ch.15 — Royal Trap',
    description: "The real Vorian has been in the palace dungeons since being replaced eight months ago. The doppelganger wore his face to attempt Leocraes's assassination at the Summer Estate.",
    personality: "No affect. No guilt. No hesitation. 'I am sorry, my Prince.' Not sorry.",
    notes: [
      "Real Vorian found alive in palace dungeons after Pride falls — eight months imprisoned",
      "Leocraes cuts off his self-recrimination with a single 'No.' Same finality as the doppelganger's dismissal.",
      "Doppelganger face melts 'just slightly, just enough' at the estate — the tell the party sees",
    ],
    firstAppearance: 2,
    statBlock: {
      name: 'Vorian — Doppelganger Assassin',
      cr: '8',
      ac: 15,
      hp: 78,
      speed: '30ft',
      str: 14, dex: 18, con: 14, int: 14, wis: 12, cha: 16,
      traits: [
        { name: 'Shapechanger', description: 'Can polymorph into any humanoid seen. AC does not change.' },
        { name: 'Surprise Attack', description: 'If hits surprised creature, deals extra 3d6 damage.' },
      ],
      actions: [
        { name: 'Multiattack', description: 'Two attacks with short swords.' },
        { name: 'Short Sword', description: '+7 to hit, 1d6+4 piercing.' },
      ],
    },
    tags: ['enemy', 'doppelganger', 'pride arc', 'summer estate'],
  },

  {
    id: 'warlord-goresh',
    name: 'Warlord Goresh',
    race: 'Orc',
    role: "Draven's Proxy / Siege Commander",
    status: 'Deceased',
    alignment: 'Enemy',
    location: 'Nova Clarus (Ch.8 Siege)',
    arc: 'Ch.8 — Siege',
    description: "General Draven's field commander for the Siege of Nova Clarus. Wrath-Infused, brutal, a proxy for the general the party wasn't ready to face yet.",
    personality: "Military. Overwhelming force. Does not negotiate.",
    notes: [
      "Draven's proxy — the party's first taste of Wrath before Mount Vorrath",
      "Wrath-Infused: enhanced strength and resilience",
    ],
    firstAppearance: 8,
    statBlock: {
      name: 'Warlord Goresh',
      cr: '9',
      ac: 17,
      hp: 138,
      speed: '35ft',
      str: 22, dex: 12, con: 20, int: 12, wis: 14, cha: 14,
      traits: [
        { name: 'Wrath-Infused', description: 'All attacks deal +1d6 fire damage. Cannot be charmed or frightened.' },
        { name: 'Relentless (1/day)', description: 'When reduced to 0 HP, drops to 1 HP instead.' },
      ],
      legendaryActions: [
        { name: 'Attack', description: 'One great axe attack.' },
        { name: 'Move', description: 'Move up to speed.' },
      ],
    },
    tags: ['enemy', 'wrath arc', 'siege', 'deceased'],
  },

  {
    id: 'maren-voss',
    name: 'Lieutenant Maren Voss',
    race: 'Human',
    role: "Draven's Senior Lieutenant",
    status: 'Active',
    alignment: 'Enemy',
    location: 'Mount Vorrath — Tier 2',
    arc: 'Ch.14 — Wrath',
    description: "Draven's senior surviving lieutenant. A human woman in her forties with flat eyes. Chose Draven because Draven wins. No ideology. Pure pragmatism.",
    personality: "Cold calculation. At 50% HP she stops and negotiates — not surrender, assessment.",
    notes: [
      "Will offer intelligence on Tier 3 and Draven's fighting patterns for a guarantee she walks away",
      "If accepted: keeps her word exactly. She is not capable of anything else.",
      "Not redeemable in the traditional sense — made clear-eyed choices. But her offer is genuine.",
    ],
    firstAppearance: 14,
    statBlock: {
      name: 'Lieutenant Maren Voss',
      cr: '7',
      ac: 16,
      hp: 105,
      speed: '30ft',
      str: 16, dex: 18, con: 16, int: 16, wis: 14, cha: 12,
      traits: [
        { name: 'Negotiation Threshold', description: 'At 50% HP, Maren stops fighting and offers a deal. She will not break her word.' },
      ],
      actions: [
        { name: 'Multiattack', description: 'Three short sword attacks.' },
        { name: 'Short Sword', description: '+7 to hit, 1d6+4 piercing.' },
      ],
    },
    tags: ['enemy', 'wrath arc', 'mount vorrath'],
  },

  // ============================================================
  // CREATURES
  // ============================================================

  {
    id: 'scavenger-goblin',
    name: 'Scavenger Goblin',
    race: 'Goblinoid (Small Humanoid)',
    role: 'Wilderness Pest',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Wilderness near Janus',
    arc: 'Ch.1 — The First Step',
    description: "A scrawny, scrappy goblin that travels in packs and fights like a coward — stab from cover, scatter when the odds turn. The party's first encounter in their new bodies.",
    personality: "Opportunistic. Cowardly. Locked onto a target and unwilling to break off until the pack is broken.",
    notes: [
      "Ch.1 Encounter 1: pack of 4 harassing Fizzle outside Janus. Low-stakes 'shake the rust off' fight.",
      "The pack scatters if 3 or more are dropped.",
      "Their goal is Fizzle, not the party — they will ignore players in favor of the pixie, forcing intervention.",
      "Stat block source: docs/Creatures/scavengerGoblin.md",
    ],
    firstAppearance: 1,
    statBlock: {
      name: 'Scavenger Goblin',
      cr: '1/4',
      ac: 12,
      hp: '5 (2d4)',
      speed: '30ft',
      str: 8, dex: 12, con: 10, int: 10, wis: 8, cha: 8,
      skills: ['Stealth +5'],
      senses: 'Darkvision 60ft, Passive Perception 9',
      languages: 'Common, Goblin',
      image: '/images/scavengerGoblin.png',
      traits: [
        { name: 'Nimble Escape', description: 'The goblin can take the Disengage or Hide action as a bonus action on each of its turns.' },
      ],
      actions: [
        { name: 'Dagger', description: 'Melee Weapon Attack: +3 to hit, reach 5ft, one target. Hit: 3 (1d4+1) piercing damage.' },
      ],
    },
    tags: ['creature', 'goblin', 'ch1', 'wilderness'],
  },

  {
    id: 'wrathbound-soldier',
    name: 'Wrathbound Soldier',
    race: 'Humanoid (Wrath-touched)',
    role: "Draven's Foot Soldier",
    status: 'Active',
    alignment: 'Enemy',
    location: 'The Ruins of Janus',
    arc: 'Ch.1 — The First Step',
    description: "A thug from Draven's army, infused with a fragment of Wrath. Eyes glow red. Steam rises from the skin. Fights aggressively, without mercy, and does not retreat.",
    personality: "No fear. No restraint. The Wrath-infusion strips off whatever hesitation a normal soldier might have — they fight until they fall.",
    notes: [
      "Ch.1 Encounter 2: a squad of 4 combs the ruins of Janus for survivors. They precede General Draven's arrival.",
      "Pack Tactics — they fight better in groups. Splitting them up is the easiest way to blunt the encounter.",
      "Reduce the count if the party is struggling — Draven's reveal lands harder if they win this one cleanly.",
      "Stat block source: docs/Creatures/wrathboundSoldier.md",
    ],
    firstAppearance: 1,
    statBlock: {
      name: 'Wrathbound Soldier',
      cr: '1/2',
      ac: 11,
      hp: '22 (5d8+2)',
      speed: '30ft',
      str: 15, dex: 11, con: 14, int: 10, wis: 10, cha: 11,
      skills: ['Intimidation +2'],
      senses: 'Passive Perception 10',
      languages: 'Common',
      image: '/images/wrathboundSoldier.png',
      traits: [
        { name: 'Pack Tactics', description: "The soldier has advantage on an attack roll against a creature if at least one of the soldier's allies is within 5ft of the creature and the ally isn't incapacitated." },
      ],
      actions: [
        { name: 'Multiattack', description: 'The soldier makes two mace attacks.' },
        { name: 'Mace', description: 'Melee Weapon Attack: +4 to hit, reach 5ft, one target. Hit: 5 (1d6+2) bludgeoning damage.' },
        { name: 'Heavy Crossbow', description: 'Ranged Weapon Attack: +2 to hit, range 100/400ft, one target. Hit: 5 (1d10) piercing damage.' },
      ],
    },
    tags: ['creature', 'wrath', 'soldier', 'ch1', 'janus'],
  },

  {
    id: 'coin-golem',
    name: 'Coin Golem',
    race: 'Construct',
    role: 'Greed Minion',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Gildmaw / Gildmaw Penthouse',
    arc: 'Ch.9 — Greed',
    description: "Constructs of hardened gold animated by the Sin of Greed. Burst into molten coins on death.",
    personality: "No personality — pure construct.",
    notes: [
      "Death burst: 2d6 fire damage to all within 5ft — dangerous in clustered penthouse spaces",
      "Prioritize early in the Avarus fight to prevent burst damage",
    ],
    firstAppearance: 9,
    statBlock: {
      name: 'Coin Golem',
      cr: '3',
      ac: 14,
      hp: 52,
      speed: '25ft',
      str: 18, dex: 8, con: 16, int: 3, wis: 8, cha: 1,
      traits: [
        { name: 'Gold Burst', description: 'On death: explodes into molten coins, 2d6 fire damage to all within 5ft. DC 14 DEX save for half.' },
        { name: 'Immutable Form', description: 'Immune to spells that would alter its form.' },
      ],
      actions: [
        { name: 'Gold Slam', description: '+6 to hit, 2d6+4 bludgeoning damage.' },
      ],
    },
    tags: ['creature', 'construct', 'greed', 'gildmaw'],
  },

  {
    id: 'masked-thrall',
    name: 'Lust Masked Thrall',
    race: 'Humanoid (various)',
    role: 'Lust Minion — Victims, not enemies',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Veilmoor — Palace of Sighs',
    arc: 'Ch.10 — Lust',
    description: "Citizens of Veilmoor under the Matriarch's Charm, defending her instinctively. They are not enemies — they are victims. The party can spend an action attempting to remove their mask.",
    personality: "Compelled, not malicious. Will fight if mask is not removed.",
    notes: [
      "Removing mask: DC (scaled) Athletics or Sleight of Hand",
      "Mask removal frees them from Charm but triggers mask removal consequence: 2d6 psychic damage",
      "The Matriarch does not care if thralls are killed — she cares about the party caring about it",
      "Party CAN kill them. That is the moral weight of the encounter.",
    ],
    firstAppearance: 10,
    statBlock: {
      name: 'Lust Masked Thrall',
      cr: '1/2',
      ac: 12,
      hp: 32,
      speed: '30ft',
      str: 12, dex: 12, con: 12, int: 10, wis: 6, cha: 10,
      traits: [
        { name: 'Charmed', description: 'Charmed by the Matriarch. Uses Reaction to protect her from attacks.' },
        { name: 'Mask Removal', description: 'DC (scaled) Athletics or Sleight of Hand to remove mask. Success: freed from Charm but takes 2d6 psychic from the warmth loss.' },
      ],
      actions: [
        { name: 'Improvised Weapon', description: '+3 to hit, 1d6+1 bludgeoning.' },
      ],
    },
    tags: ['creature', 'lust', 'veilmoor', 'victim'],
  },

  {
    id: 'wrath-infused-veteran',
    name: 'Wrath-Infused Veteran',
    race: 'Humanoid (Soldier)',
    role: "Draven's Army",
    status: 'Active',
    alignment: 'Enemy',
    location: 'Mount Vorrath / Various',
    arc: 'Ch.8, Ch.14',
    description: "Standard soldiers from Draven's army, enhanced by the Sin of Wrath. They have been in the volcano's heat so long they no longer sweat. The Wrath-Infusion leaves when Draven falls.",
    personality: "Military discipline. Fight until incapacitated.",
    notes: [
      "Soul Siphon hitting the Wrath-Infused Champion drops HP by 40 and removes Relentless — watching soldiers hesitate for one round",
      "After Draven falls: Wrath-Infusion leaves their eyes in a wave. They sit down. Some weep.",
    ],
    firstAppearance: 8,
    statBlock: {
      name: 'Wrath-Infused Veteran',
      cr: '3',
      ac: 16,
      hp: 58,
      speed: '30ft',
      str: 16, dex: 13, con: 16, int: 12, wis: 11, cha: 10,
      traits: [
        { name: 'Wrath-Infused', description: 'All attacks deal +1d6 fire damage. Immune to Frightened condition.' },
        { name: 'Relentless (1/day, Champions only)', description: 'When reduced to 0 HP, drops to 1 HP instead.' },
      ],
      actions: [
        { name: 'Multiattack', description: 'Two longsword attacks.' },
        { name: 'Longsword', description: '+5 to hit, 1d8+3 slashing + 1d6 fire.' },
      ],
    },
    tags: ['creature', 'soldier', 'wrath', 'mount vorrath'],
  },

  {
    id: 'dream-eater',
    name: 'Dream Eater (Sloth Corrupted)',
    race: 'Aberration',
    role: 'Sloth Minion — Corrupted dreamscape creature',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Somnara Dreamscape',
    arc: 'Ch.12 — Sloth',
    description: "Manifests in the corrupted zones of Pip's dreamscape where the Sin's influence has turned beautiful imagery hostile. Made of stolen stillness and grey mist.",
    personality: "No agenda — just the weight of stopped things.",
    notes: [
      "Appears in corrupted zones of the dreamscape — wrong music zones, inverted bridges, gear shadows",
      "Vulnerable to Thorny's beacon of golden light (removes Difficult Terrain in 10ft radius for 1 round)",
    ],
    firstAppearance: 12,
    statBlock: {
      name: 'Dream Eater',
      cr: '4',
      ac: 13,
      hp: 65,
      speed: '0ft, fly 40ft (hover)',
      str: 6, dex: 16, con: 14, int: 10, wis: 12, cha: 14,
      traits: [
        { name: 'Incorporeal Movement', description: 'Can move through creatures and objects.' },
        { name: 'Sloth Aura', description: 'Creatures within 10ft move at half speed.' },
      ],
      actions: [
        { name: 'Mind Drain', description: '+5 to hit, 2d8+3 psychic, target must succeed DC 13 WIS save or be Incapacitated until end of next turn.' },
      ],
    },
    tags: ['creature', 'sloth', 'dreamscape', 'aberration'],
  },

  {
    id: 'envy-specter',
    name: 'Envy Specter',
    race: 'Undead (Sin-touched)',
    role: 'Envy Minion — Sin Horde (Ch.17)',
    status: 'Active',
    alignment: 'Enemy',
    location: 'Mountain Dungeon — Wave Fight',
    arc: 'Ch.17 — Sin Horde',
    description: "Manifests in the Sin Horde wave fight outside the Mountain Dungeon. Steals one party ability per round.",
    personality: "Pure want. No identity of its own.",
    notes: [
      "Appears in the endless wave fight outside the dungeon in Ch.17",
      "Highest priority target each round it appears",
      "Stolen ability returned when Specter is destroyed",
    ],
    firstAppearance: 17,
    statBlock: {
      name: 'Envy Specter',
      cr: '5',
      ac: 13,
      hp: 45,
      speed: '0ft, fly 50ft (hover)',
      str: 1, dex: 14, con: 11, int: 10, wis: 10, cha: 11,
      traits: [
        { name: 'Incorporeal', description: 'Immune to non-magical bludgeoning, piercing, slashing damage.' },
      ],
      actions: [
        { name: 'Ability Theft', description: 'Target one creature. DC 14 CHA save or the Specter steals one class feature, spell slot, or stat modifier until the Specter is destroyed.' },
        { name: 'Life Drain', description: '+4 to hit, 3d6 necrotic.' },
      ],
    },
    tags: ['creature', 'undead', 'envy', 'sin horde'],
  },

]

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getNPC(id: string): NPC | undefined {
  return npcs.find((n) => n.id === id)
}

export function getNPCsByArc(arc: string): NPC[] {
  return npcs.filter((n) => n.arc.toLowerCase().includes(arc.toLowerCase()))
}

export function getNPCsByAlignment(alignment: NPC['alignment']): NPC[] {
  return npcs.filter((n) => n.alignment === alignment)
}

export function getNPCsByTag(tag: string): NPC[] {
  return npcs.filter((n) => n.tags.includes(tag))
}

export function searchNPCs(query: string): NPC[] {
  const q = query.toLowerCase()
  return npcs.filter((n) =>
    n.name.toLowerCase().includes(q) ||
    n.role.toLowerCase().includes(q) ||
    n.description.toLowerCase().includes(q) ||
    n.tags.some((t) => t.includes(q)) ||
    n.notes.some((note) => note.toLowerCase().includes(q))
  )
}

export const ALL_TAGS = Array.from(new Set(npcs.flatMap((n) => n.tags))).sort()
export const ALL_ARCS = Array.from(new Set(npcs.map((n) => n.arc))).sort()

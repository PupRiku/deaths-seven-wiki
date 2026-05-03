import type { Chapter } from "@/types"

const chapter: Chapter = {
      number: 3,
      act: 1 as const,
      title: "The Dragon's Spine",
      levelStart: 5,
      levelEnd: 6,
      summary: "Following Thraggin's revelation about Darkon, the party convenes with Nazura and Leocraes for a grim but unified planning session before a quiet send-off from the squad house. They research Darkon in the labyrinthine Nova Clarus University Archives — a place with locked wings, documents that react to touch, and at least one section nobody is supposed to enter. Then they ride west through three increasingly unsettling road encounters before arriving at the Iron Gate, where a silent masked figure waits to take them into the mountains.",
      sections: [
        {
          title: "Part 1 — The War Room",
          type: "scene",
          content: "The morning after Thraggin's verdict, Nazura convenes a private meeting in the Sentinels' war room. It is just her, Leocraes, Thraggin, Fizzle, and the party. A map of the kingdom is spread across the table. Nobody has slept particularly well.",
          boxedText: "Nazura stands at the head of the table, arms crossed, staring at the map. She lets the silence run for a moment before she speaks. 'Right. Darkon. For those of you who don't know — and that's most of you — Darkon is a city under permanent military lockdown. It has been for decades. The pass through the Dragon's Spine is the only way in, and the city does not welcome outsiders.' She looks up. 'And it's the only place in the world that can do what needs to be done. So. We figure out how to get you there and back in one piece.'",
          keyInfo: [
            "Thraggin confirms there is no alternative — Darkon's Obitus Scholare are the only known Soulsmiths. He has already begun compiling research notes for the party to take.",
            "Leocraes offers the Sentinels' fastest mounts and cold-weather gear. He will coordinate resupply at the outpost of Lastlight, the westernmost Sentinel fortress.",
            "Nazura grants the party special access to the Nova Clarus University Archives before they depart. 'Know what you're walking into. Our records on Darkon are old and incomplete — but they're better than nothing.'",
            "Nobody argues about whether to go. Everyone knows it has to happen. The meeting ends quickly, practically, and without ceremony.",
          ],
          dmNote: "Keep this scene efficient. The emotional weight is in what is NOT said — Nazura handing over the travel papers without a speech, Leocraes shaking everyone's hand a beat too long, Thraggin gruffly pressing his research notes into someone's hands and immediately turning back to his workbench. Grim and unified. The send-off from the squad house should be equally quiet — a last look at the pups, a last meal, then the road.",
        },
        {
          title: "The Send-Off",
          type: "scene",
          content: "Before they leave, the party has one last morning at the squad house. This is a short, quiet scene — no quests, no objectives. Just a moment before everything changes again.",
          keyInfo: [
            "The pups are old enough now to be genuinely playful. They blink around the squad house underfoot. Someone will almost certainly trip.",
            "The party must decide what to do with the pups while they are gone. Options: leave them with Fizzle, ask Nazura to assign a Sentinel to check in, or ask Mama Bess's neighbors in Janus if any survivors made it to the city.",
            "Fizzle is uncharacteristically quiet on the road out of the city. She picks up once they clear the gates.",
          ],
          dmNote: "Ask each player one question: what does your character do in the last hour before you leave? Let the answers happen. Don't plan around them — just make space. One player will do something funny. One will do something unexpectedly moving. Both are correct.",
        },
        {
          title: "Part 2 — The University Archives",
          type: "scene",
          content: "Nazura's letter of access gets the party through the main doors of the Nova Clarus University Archives — the largest repository of knowledge in the kingdom. The archivist on duty, a young man named Corvin, is visibly nervous about their clearance level.",
          boxedText: "The archive is not what you expected. You imagined shelves. What you find instead is a vast, multi-tiered atrium — a cathedral of knowledge that seems to have grown organically over centuries, with staircases leading to galleries that don't quite line up, reading alcoves tucked into improbable corners, and corridors that branch and double back with no obvious logic. Signs are infrequent and occasionally contradictory. Somewhere deeper in, a clock ticks. You cannot find it.",
          keyInfo: [
            "NAVIGATION: The archive is genuinely maze-like. Moving between sections requires DC 10 Investigation or Survival checks to navigate efficiently. Failure doesn't block progress — it costs time and leads to unexpected discoveries (roll on the Unexpected Finds table).",
            "UNEXPECTED FINDS TABLE (d6): 1 — A hand-drawn map of the Dragon's Spine pass with notes in a language nobody speaks. 2 — A bestiary entry for Jaegers, heavily annotated in the margins by a previous reader. 3 — A sealed letter addressed to 'whoever finds this — DO NOT OPEN IN DARKON.' 4 — A pressed flower from Jägerweiler, dated 40 years ago, tucked in a trade log. 5 — A child's drawing of the Maw, labeled 'the belly of the world,' filed under astronomy. 6 — A journal entry that references 'the five who will come' with no further context.",
            "REACTIVE DOCUMENTS: Certain documents in the Darkon section react to arcane presence. If a caster touches them, faded ink becomes legible, revealing an extra layer of information beyond what mundane readers can access. These bonus revelations include: the Jaegers' creation process described in clinical detail; a warning that the Obitus Scholare can detect magical auras; and a note that the Grand Cathedral's bells are not rung to call worshippers — they are rung to drive something back.",
            "CORVIN: The young archivist follows the party at a respectful distance, clearly torn between helpfulness and anxiety. DC 13 Persuasion or a kind word unlocks him — he knows the archive better than anyone and can guide the party to specific sections without navigation checks. He also knows about the forbidden wing. He will not say so unprompted.",
          ],
          dmNote: "Give the archive thirty to forty minutes of real table time. Let players split up and explore different sections simultaneously. The maze quality is the point — it should feel like the knowledge is hidden not out of malice but out of accumulated chaos. Corvin is a good NPC to invest in briefly: nervous, clever, genuinely fond of the archive. He may appear again.",
        },
        {
          title: "The Archives — Lore Tiers",
          type: "scene",
          content: "The party can research Darkon through skill checks, reactive documents, or Corvin's guidance. Information is tiered by difficulty.",
          keyInfo: [
            "DC 10 — COMMON KNOWLEDGE: Darkon (formerly Luyarnha) was once a wealthy trade hub, now under total military lockdown (Order 34). Ruled by the Radiant Church. Plagued by the Scourge — a disease that turns people into beasts, which is why neighboring nations threatened to destroy the city.",
            "DC 15 — UNCOMMON KNOWLEDGE: Two rival factions share power — the Obitus Scholare (secret police and researchers using forbidden magic) and the Scions (engineers who rebuilt the city using advanced technology). Significant tension between them.",
            "DC 20 — RARE LORE: The Obitus Scholare created living weapons called Jaegers through blood infusion and 'loss of humanity.' Blood Moons trigger spikes of extreme violence called 'The Hunt.' An architectural blueprint of the Grand Cathedral shows a massive subterranean wing labeled 'Asylum / Research' with a later note in red ink: SEALED. DO NOT OPEN. THE SCREAMS.",
            "REACTIVE DOCUMENTS BONUS: The Jaegers' creation is described clinically — it involves willing subjects, progressive infusion, and an irreversible threshold. The Obitus can detect magical auras on entry. The Cathedral bells drive something back, not in.",
          ],
          dmNote: "Don't read all of this aloud. Let players earn it through exploration and rolls. The reactive document bonuses should feel like a genuine discovery — have the ink visibly shift and darken when a caster makes contact. The 'SEALED. DO NOT OPEN. THE SCREAMS.' note should be read in a completely flat voice. Let the silence after it do the work.",
        },
        {
          title: "The Forbidden Wing",
          type: "scene",
          content: "Deep in the archive, behind a locked iron gate marked 'RESTRICTED — UNIVERSITY FACULTY ONLY,' is a wing that Corvin will not discuss. The gate is old. The lock is not.",
          keyInfo: [
            "Corvin, if asked directly, goes pale and says only: 'That section was sealed by university order fourteen years ago. I don't have a key. I've never been inside.' He is telling the truth about the key.",
            "The lock can be picked (DC 17 Thieves' Tools) or the gate can be forced (DC 18 Strength) — either will work but will alarm Corvin.",
            "INSIDE: A single reading room. Every document on the shelves relates to one subject: the Aspirant. Not by name — by description. 'The Mortal Who Spoke to Death.' Records of his movements going back fifteen years. Correspondence between university scholars and someone referred to only as 'our contact in the pass.' A hand-drawn portrait — hooded, face obscured. And a single burned document, mostly ash, with one legible line: 'He has already been to Darkon.'",
            "The documents were sealed after the lead researcher who assembled them disappeared without explanation.",
          ],
          dmNote: "This is the campaign's first real glimpse of the Aspirant's history and scope. Do not over-explain it. Let the party piece it together themselves — the fifteen years of records, the university contact, the burned document. The portrait with the obscured face is the detail that will haunt them. If they show it to Corvin, he recognises it as the work of Professor Aldren — the researcher who disappeared. He has not thought about Aldren in years. He looks like he wishes he still hadn't.",
        },
        {
          title: "Part 3 — The Journey West: Lastlight",
          type: "scene",
          content: "A week into the journey west, the party reaches Lastlight — the westernmost fortress of Nova Clarus, a cold and wind-battered outpost at the edge of Sentinel territory.",
          boxedText: "Captain Yelena slams a rolled parchment onto the table hard enough to rattle the mugs. 'A royal edict. From the King himself. I am ordered to surrender half of my crystal-powered defensive barriers — the barriers that keep this outpost standing — to be repurposed for a grand statue of His Majesty's recent victories.' She looks at you. 'I don't have recent victories. I have a frontier. But apparently that matters less than a very large statue.'",
          keyInfo: [
            "Captain Yelena is furious, exhausted, and running on spite. She is a good soldier being asked to do something that will get her people killed.",
            "The edict is genuine — signed and sealed by the King. A DC 14 Investigation check on the document reveals the seal has a minor imperfection — the wax is slightly too perfect, as if pressed by someone unfamiliar with the ring.",
            "PLAYER AGENCY: The party can help Yelena draft a formal objection to send back to Nova Clarus (DC 13 Persuasion — buys her two weeks before compliance is enforced), quietly help her hide some of the barriers before the King's inspectors arrive (DC 14 Sleight of Hand or Deception), or simply witness and move on.",
            "The Pride parallel is deliberate — a ruler stripping frontier defenses for vanity mirrors Darkon's Godless King, whose obsession with his own image cost his people their safety.",
          ],
          dmNote: "Yelena is not a major character but she deserves to feel real. She is doing her job in impossible circumstances and she knows it. If the party helps her, she gives them a vial of Lastlight Crystal Oil — a rare substance that keeps metal from freezing in mountain conditions. It will matter in the pass. If they don't help, she watches them leave with the particular expression of someone used to being left.",
        },
        {
          title: "The Journey West: The Caravan Wreckage",
          type: "scene",
          content: "Past Lastlight, the protected road ends. The party comes across the wreckage of a merchant caravan — wagons splintered, guards dead, but food and water untouched. Every item of value has been stripped with surgical precision.",
          boxedText: "It is not the destruction that unsettles you. It is the silence of it. No blood frenzy, no scattered loot, no signs of panic. Whatever hit this caravan knew exactly what it wanted and took only that. A survivor is hiding in the thicket.",
          keyInfo: [
            "The survivor, a young merchant's assistant named Petra, is in shock. She describes the attackers: 'Silent. Organised. They didn't just steal — they collected. Like they were filling a quota.'",
            "A DC 12 Perception check on the bodies of the attackers' fallen members reveals a fresh tattoo on each forearm: a grasping hand crushing a handful of coins. Second Greed clue — same symbol as the Goldenweave ambush.",
            "ENCOUNTER: A cleanup crew of Bandits returns (Bandits and a Bandit Captain). They fight with unusual military efficiency — these are not common highwaymen.",
            "Petra, if the party helps her, asks to travel with them as far as Lastlight. She knows the road and has useful information about recent caravan disappearances along the western route.",
          ],
          dmNote: "Petra is optional depth. If a player gravitates toward her, let her breathe. She has a destination, a name, and a reason to be grateful. She does not need to be a recurring character — but she could be. The key detail is the tattoo matching the Goldenweave ambush: this is not coincidence, and smart players will clock it as a connected organisation.",
        },
        {
          title: "The Journey West: Hollowcreek",
          type: "scene",
          content: "As the party nears the Dragon's Spine foothills, the world changes. The trees grow pale and leafless. An oppressive silence hangs over everything. Then they find Hollowcreek — a small village that is simply empty. No fire, no blood, no sign of struggle. Just absence.",
          boxedText: "The village is intact. The bread is still on the tables. A child's shoe sits in the middle of the road. There is no wind. The silence here is not the silence of a place at rest — it is the silence of a place that has been listening for a very long time.",
          keyInfo: [
            "INVESTIGATION — THE VILLAGE: DC 10 Investigation finds the village hall. Inside, furniture is arranged in concentric circles facing the center of the room, as if for a gathering that never ended.",
            "INVESTIGATION — THE JOURNAL: DC 12 Investigation in the village hall uncovers a hastily-written journal beneath a loose floorboard. Most entries are mundane — harvests, weather, minor disputes. The final entry reads: 'The bells. We hear the bells from the pass. We must answer the call. The city must be fed. We are so... hollow.'",
            "PLAYER AGENCY — FOLLOWING THE BELLS: If the party listens carefully (DC 13 Perception), they can still faintly hear something from the direction of the pass — not quite bells, not quite music. They can choose to follow it or leave it alone.",
            "IF THEY FOLLOW: The sound leads them to a cave mouth at the base of the mountain. Inside, a single figure sits cross-legged facing the wall — an elderly man in Hollowcreek clothing, completely unresponsive, breathing slowly. He cannot be woken by mundane means. A DC 15 Arcana check identifies the sound as a compulsion effect. Dispel Magic (DC 14) breaks it — the man gasps awake, terrified, with no memory of how he got there or how long he has been sitting. He only remembers: 'The bells said the city needed to eat.'",
            "IF THEY LEAVE: The sound fades as they move on. The cave is still there. The man is still sitting.",
          ],
          dmNote: "Hollowcreek is the campaign's first real taste of Sloth — not as a character, but as an atmosphere. The compulsion is subtle and ancient and patient. If the party rescues the man, he is the only surviving Hollowcreek resident. He has nowhere to go. What they do with him is entirely up to them — but sending him back to an empty village or leaving him at the Iron Gate outpost are both quietly devastating options. If players engage deeply here, reward it. If they don't, let the silence follow them for a few minutes before Fizzle starts talking again.",
        },
        {
          title: "Part 4 — The Iron Gate",
          type: "scene",
          content: "Following the mountain path, the party arrives at the Iron Gate — a simple, ominous arch of black stone marking the entrance to the Dragon's Spine pass. Standing beside it is a single tall figure in a heavy dark-grey cloak, face hidden behind a featureless porcelain mask.",
          boxedText: "The figure does not react as you approach. It turns its masked face toward each of you in turn — a slow, deliberate assessment that feels more like measurement than greeting. It does not speak. After a long silence, it holds up one hand. Stop. Then it points to a small fortified watchtower set into the cliffside. The gesture is not a suggestion.",
          keyInfo: [
            "This is the Darkonian Guide — a Jaeger of the Obitus Scholare, sent to escort outsiders through the pass.",
            "The Guide will not move until the party has taken a full long rest. The message is clear: what is ahead requires you to be at full strength.",
            "The Guide does not speak. It does not acknowledge questions. It watches.",
            "The watchtower is stocked with basic supplies — firewood, rations, bedrolls. Someone has been expecting them.",
            "LEVEL UP: Characters advance to Level 6.",
          ],
          dmNote: "The Iron Gate is a hard stop on pacing — a moment of enforced stillness before the gauntlet begins. Use it. Let the party sit with the silence, the masked figure, the mountain ahead. If someone tries to communicate with the Guide, it turns its head toward them and waits. Whatever they say, it does not respond. It just waits. The watchtower being stocked is the most unsettling detail — someone knew they were coming and knew when they would arrive. Nobody comments on this.",
        },
      ],
    }

export default chapter

import type { Chapter } from "@/types"

const chapter: Chapter = {
      number: 6,
      act: 1 as const,
      title: "The Asylum",
      levelStart: 7,
      levelEnd: 8,
      summary: "Albinus leads the party to the sealed blast doors of the Asylum beneath the Grand Cathedral. At the threshold he tells them something he has never told anyone. Then he closes the door. The party descends through three levels of horror — the Upper Ward of blind mutilated patients, the Laboratory where something worse than a patient is waiting, and the Disposal Ward where the Roaring Mane has been hungry for decades. At the bottom, a flooded breach leads to the forgotten sewer and out under the walls. The party does not come back the same way they went in.",
      sections: [
        {
          title: "The Madness System",
          type: "prose",
          content: "This chapter uses madness mechanics from Steinhardt's Guide to the Eldritch Hunt. The following is a summary for table use.",
          keyInfo: [
            "MADNESS TRIGGERS: Certain moments require a Wisdom saving throw. Failure inflicts a madness effect. DC and duration are noted per trigger.",
            "SHORT-TERM MADNESS (1d10 minutes) — Roll d6: 1: Overwhelmed, use action to Dodge. 2: Paranoid, cannot willingly move closer to allies. 3: Reckless, must attack nearest creature. 4: Frozen, speed becomes 0. 5: Babbling, cannot cast spells with verbal components. 6: Violent, must use action to attack nearest creature friend or foe.",
            "LONG-TERM MADNESS (1d10 x 10 hours) — Roll d6: 1: Compulsion — DM assigns repeated behaviour. 2: Amnesia — forget one fact. 3: Phobia — Frightened of specific trigger. 4: Delusion — believes something false and acts on it. 5: Dissociation — refers to self in third person. 6: Obsession — fixates on one object or goal.",
            "STUNNED ON TRIGGER: When first afflicted with any madness, the creature is Stunned until start of next turn.",
            "RECOVERY: Short-term ends naturally. Long-term requires DC 15 Wisdom save after long rest, or magical intervention.",
          ],
          dmNote: "Track madness effects openly. When a player rolls a madness effect, hand them a small card with the specific behaviour so they can roleplay it without announcing it. The best madness moments happen when other players notice something is wrong before they are told.",
        },
        {
          title: "The Threshold — Albinus",
          type: "scene",
          content: "Albinus leads the party through the Forbidden Lore wing and stops before massive blast doors marked with a single red X. He produces a key. His hands are steady. They should not be.",
          boxedText: "He does not insert the key immediately. He stands with it in his hand, looking at the door, and for a moment the precise analytical mask slips — just slightly, just enough. 'I should tell you something,' he says. 'Before you go in.' He turns. 'I designed the containment systems for the lower two levels. The Laboratory. The Disposal Ward. I was twenty-six. I was very good at my work.' A pause. 'I have not been back in since the sealing. I will not be going in now. This is not cowardice. It is the one mercy I am still capable of extending to myself.' He turns back to the door and inserts the key. 'The breach is in the lowest level. Follow the water down. Do not stop moving.'",
          keyInfo: [
            "Albinus will answer one follow-up question. One. Then he opens the door.",
            "If asked why he designed it: 'I believed in the work. I was wrong to.'",
            "If asked what is in there: 'Things that should not have been made. I made them anyway.'",
            "If asked if anyone survived: a very long pause. 'I don't know. I stopped reading the reports.'",
            "The door opens. Cold air flows out. Albinus steps back. He will be at this door when they return — or he will not.",
          ],
          dmNote: "The one-question limit is critical — it forces players to choose what they most want to know. Whatever they ask, answer in one sentence and move on. The door is open. The cold is already in the room.",
        },
        {
          title: "Entering the Asylum",
          type: "scene",
          content: "The party steps beyond the blast doors. The geometry feels wrong — not impossible, just slightly off, as if designed by someone who understood space intellectually but had never lived in it.",
          boxedText: "The air is stale and cold and smells of rust and old copper. The silence is absolute except for a sound you cannot place — not quite a hum, not quite breathing, coming from everywhere and nowhere at once. The walls are covered in scratch marks. Some of them are words in languages that don't exist. Some of them are just numbers, counted up and then crossed out, over and over until the stone is worn smooth.",
          keyInfo: [
            "MADNESS TRIGGER — THE THRESHOLD: Each character makes a DC 13 Wisdom saving throw on entering. Failure: Short-Term Madness.",
            "NAVIGATION: The Asylum branches. Not a straight corridor.",
            "LIGHT: Torches and light spells function normally, but shadows move a half-second after the light source does.",
          ],
          dmNote: "The scratch marks are not a puzzle. Do not make them a puzzle. If a player spends time trying to decode them, let them find one legible phrase: 'IT KNOWS YOUR NAME.' This is not true. But it will bother them.",
        },
        {
          title: "Asylum Layout",
          type: "scene",
          content: "Three descending levels connected by staircases. The main path runs Upper Ward to Laboratory to Disposal Ward. Wrong turns reveal additional rooms.",
          keyInfo: [
            "UPPER WARD BRANCH — The Warden's Office: DC 14 Thieves' Tools. Inside: Albinus's original design schematics for the lower levels, annotated in his precise hand. A DC 15 Investigation check reveals a sealed sub-chamber off the Disposal Ward labeled only 'ARCHIVE.' Also inside: a potion of Greater Restoration and 40gp in old Darkonian coin.",
            "LABORATORY BRANCH — The Specimen Wing: rows of sealed glass containers, most empty. DC 12 Perception notices one container is warm. DC 14 Arcana identifies the contents as a living Jaeger embryo in stasis — incomplete, never activated. Worth significant gold to the right buyer, or significant trouble if the wrong person learns they have it.",
            "DISPOSAL WARD — The Archive: from the schematics, a sealed sub-chamber requires DC 16 Strength or the schematics to locate the hidden release. Inside: records of every patient — names, conditions, outcomes. Most outcomes are a single word. Also inside: Albinus's personal journal, age 26. Last entry: 'The Mane responds to the sound of its designation. I have named it. I should not have named it.'",
          ],
          dmNote: "The Warden's Office is the most important branch — the schematics reward exploration and seed the Archive. The Jaeger embryo is a deliberate moral grenade. The journal is the emotional payload of the entire Asylum. Players who find it and then walk back out to find Albinus waiting will have a very different conversation with him.",
        },
        {
          title: "Encounter 1 — The Blind Weepers",
          type: "encounter",
          content: "From the shadows of the Upper Ward cells, figures emerge — humanoid, with their eyes replaced by jagged metal devices fused into their skulls. They cannot see. They can hear everything.",
          creatures: [
            "4-6 Enhanced Patients (CR 2) — blind, Tremorsense 30ft",
            "Wail of Insanity (Recharge 5-6): DC 13 Wisdom save or Short-Term Madness + Stunned until start of next turn",
            "Mad Strength: +5 to hit, 2d6+3 bludgeoning damage",
          ],
          tactics: "The patients wait motionless until a creature moves, then swarm toward the vibration. Silent movement (DC 14 Stealth) can bypass this encounter entirely. The Wail of Insanity prioritizes isolated targets at the back of the corridor.",
          dmNote: "The bypass option is intentional. Players who think to move carefully should be rewarded. The Upper Ward should feel like a place where caution is the right answer.",
        },
        {
          title: "Encounter 2 — The Scorched Adjudicator",
          type: "encounter",
          content: "Standing in the center of the surgical theater, studying a dissected specimen, is a tall figure in charred armor. Wings of shadow and flame fold against its back. It turns with recognition, not surprise.",
          boxedText: "A voice speaks in your minds, cold and precise as a scalpel. 'I smell hope. How impure. Let me cut it out.'",
          creatures: [
            "1 Scorched Adjudicator (CR 5)",
            "Snuff Out the Light (Reaction): when a creature casts a healing spell within 30ft, immediately makes one melee attack against them",
            "Soul Tear: on a hit, target's max HP reduced by 1d8 until long rest",
            "Teleport (Bonus Action): after a melee attack, teleports up to 30ft",
          ],
          tactics: "The Adjudicator punishes healing — saves its Reaction specifically for healing spells. Uses Teleport to stay mobile and target isolated characters. Soul Tear on the tankiest character accumulates dangerously. It carries the key to the lower staircase.",
          dmNote: "The first time it uses the Reaction to interrupt a heal, the table should understand the rules have changed. Parties that front-load burst damage and use healing items instead of spells will find this significantly easier.",
        },
        {
          title: "Boss Encounter — The Roaring Mane",
          type: "encounter",
          content: "The ground beneath the party explodes upward. What emerges has been here alone for decades. It remembers its name.",
          boxedText: "MADNESS TRIGGER — THE SIGHT: Seeing the Roaring Mane triggers a DC 15 Wisdom saving throw. Failure: Long-Term Madness. On a failure the character is also Stunned for one round — the Mane gets a free round of attacks.",
          creatures: [
            "1 Roaring Mane (CR 8) — from Steinhardt's Guide to the Eldritch Hunt",
            "Resistant to non-magical B/P/S damage — magical weapons or the Relic Stone required",
            "Burrow speed 30ft — attacks from below, Earthen Pounce (extra damage + Prone)",
            "Tectonic Roar (Recharge 6): DC 14 Con save or Stunned, then Mane burrows away",
          ],
          tactics: "Opening move is always Burrow — attacks from below before surfacing. Earthen Pounce sets up Bonus Action Bite on Prone targets. When surrounded uses Tectonic Roar, burrows, resurfaces on an isolated target. Radiant and psychic damage bypass resistance.",
          dmNote: "If the party found Albinus's journal and reads that he named it, have the Mane pause for exactly one second when a character says its name aloud. It will not stop attacking. But it will pause. Do not explain this.",
        },
        {
          title: "The Breach and the Escape",
          type: "scene",
          content: "With the Mane defeated, the back wall of the Disposal Ward has partially collapsed — a dark slime-slicked tunnel. The ancient sewer line Albinus described.",
          boxedText: "The tunnel smells of old water and deep earth and nothing else. After the Asylum, nothing else smells like safety. You follow the flow. After what feels like an hour, light appears ahead. Not arc-lamp blue. Not Cathedral gold. Grey. Cold. Real. You step out through a culvert in a hillside outside the city walls. Behind you, Darkon rises against the sky. In front of you, a shallow red lake spreads across the valley floor. You are out. You are not clean. But you are out.",
          keyInfo: [
            "No encounters in the sewer — a deliberate decompression beat.",
            "Characters who accumulated madness effects should have a quiet moment here to notice what is different about themselves.",
            "LEVEL UP: Characters advance to Level 8.",
          ],
          dmNote: "Do not fill the sewer with encounters. The party has earned the walk. The grey light at the end is the first natural light since entering Darkon. Let that land.",
        },
        {
          title: "Albinus — The Return",
          type: "scene",
          content: "When the party makes it back to the blast doors, Albinus is there. He has not moved. He is reading a small book. He closes it when he hears them.",
          boxedText: "'You're alive.' He says it with the tone of someone confirming a calculation rather than expressing relief. He looks at each of you in turn — counting, assessing — and gives a single precise nod. 'Good. Follow me.'",
          keyInfo: [
            "If the party found his journal, he will notice them looking at him differently. He will not ask about it. If they show it to him, he takes it, holds it for a moment, and puts it in his coat. 'Thank you.' That is all.",
            "If they found the Jaeger embryo, he identifies it immediately and tells them to keep it out of sight past the Cathedral wards.",
          ],
          dmNote: "The journal exchange is the quietest and most important beat in the chapter. Two words and a coat pocket. Do not undersell it. Do not oversell it either. That is enough.",
        },
      ],
    }

export default chapter

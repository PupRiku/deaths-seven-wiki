import type { Chapter } from "@/types"

const chapter: Chapter = {
      number: 4,
      act: 1 as const,
      title: "The Iron Pass",
      levelStart: 6,
      levelEnd: 7,
      summary: "The party ascends the Dragon's Spine mountains guided by the silent Darkonian Jaeger. Three escalating encounters drain their resources and test their resolve — a ghoul ambush on an icy ledge, a madness-inducing cave of spectral souls, and a Chimera boss on a high-altitude plateau. The Guide watches everything and helps with nothing. At the top, his silence is the only verdict on how they did.",
      sections: [
        {
          title: "The Guide's Rules",
          type: "prose",
          content: "Before the ascent begins, establish these facts clearly for the players. The Guide will not fight. The Guide will not heal. The Guide will not answer questions. He walks at a measured pace and stops at specific points to allow the party to rest or regroup — but only when he decides. He is not cruel. He is indifferent. The creatures of the pass ignore him completely, as if he does not exist. He is the finish line, not the safety net.",
          dmNote: "The Guide's total silence is load-bearing. Every time a player tries to talk to him, ask him for help, or test his limits, the answer is the same: he turns his masked face toward them and waits. No nod, no shake, no gesture. He simply waits for them to finish and then continues walking. Do not break this. Not once. His value as a character depends entirely on never yielding.",
        },
        {
          title: "The Reincarnation Mechanic",
          type: "prose",
          content: "This is the first chapter where a PC may permanently die and trigger the reincarnation. If a PC fails three death saves, is killed by massive damage, or is reduced to 0 maximum HP, the following occurs after the battle ends.",
          boxedText: "The deceased character's body crumbles to ash. For a moment, there is only silence. Then Fizzle shouts, 'Look!' A mote of light — the character's soul — hovers where they fell. It begins to spin, faster and faster, pulling in motes of light and shadow from the air around it. The light expands, solidifies, and in a flash, a new body stands in its place. They are clothed, armed, and alive. The soul is the same. The vessel is new.",
          keyInfo: [
            "The player re-rolls their character using the Hardcore Method — Species, Background, Stats, Subclass randomized. Class may be chosen.",
            "Level remains the same.",
            "The character appears with basic starting equipment for their new class. Old gear is lost.",
            "This is the first memory loss — the player loses one significant memory from their past life. Work with them privately to decide what is gone.",
          ],
          dmNote: "Frame the reincarnation as strange and wondrous, not as a punishment. Fizzle's reaction sets the tone — she is awe-struck, not devastated. The Guide watches the reincarnation with the same impassive stillness he watches everything else. He has seen this before.",
        },
        {
          title: "Part 1 — The Frigid Ledge",
          type: "scene",
          content: "After the mandatory long rest at the Iron Gate outpost, the Guide sets a pace up the mountain. The first stage is a narrow icy ledge winding up the mountainside, exposed to a howling, unnatural wind.",
          keyInfo: [
            "FRIGID WHISPERS: The wind is malevolent. At the start of each turn, every creature makes a DC 10 Constitution saving throw. Failure: 1d4 cold damage and speed halved until next turn.",
            "The ledge is difficult terrain. Falling off the edge is a 60-foot drop — DC 12 Dexterity saving throw to catch a handhold, or DC 15 Athletics to climb back up.",
          ],
          dmNote: "The ledge is tight. Positioning matters. Players who think spatially about who is where will fare better than those who don't. Let the wind be a constant background pressure — not overwhelming but always present.",
        },
        {
          title: "Encounter 1 — The Hollowed",
          type: "encounter",
          content: "The wind shrieks and with it comes a wet, slavering hiss. Pale, emaciated figures with blue skin and milky white eyes crawl up from the chasm below — the former villagers of Hollowcreek, their bodies twisted by the mountain's compulsion.",
          creatures: [
            "4 Ghouls (MM p.148)",
            "2 Ghasts (MM p.148)",
          ],
          tactics: "The Ghouls prioritize Paralysis — a paralyzed character on a narrow icy ledge is in immediate danger of being pushed off. Ghasts use their Stench to force Constitution saves, compounding the Frigid Whispers damage. Focus fire on Ghasts first. The Guide stands against the cliff wall and watches.",
          dmNote: "The real threat here is the ledge, not the creatures. A paralyzed character standing near the edge with a Ghast adjacent to them is genuinely in danger of dying. Let the players feel the geography. If someone goes over the edge, let them try to catch themselves before calling it — DC 12 Dex save to grab a handhold. If they catch it, they are Prone and hanging with one action to climb back. Give them the chance.",
        },
        {
          title: "Part 2 — The Whispering Ice",
          type: "scene",
          content: "The ledge cuts through a large ice cave. The Frigid Whispers stop. The silence that replaces them is worse. The walls are dark polished ice — like mirrors. The party's reflections are wrong.",
          boxedText: "The cave is still. No wind, no sound. The walls are dark and polished to a mirror sheen, and your reflections stare back at you — but not quite right. They are a half-second behind. They show flashes of other things: your past selves, your deaths, dark shapes moving in the space behind you that are not there when you turn. Then the reflections settle. They show you as you are. And then one of them smiles. You did not smile.",
          keyInfo: [
            "WHISPERING ICE: Upon entering the cave, each character makes a DC 13 Wisdom saving throw. Failure: Short-Term Madness (DMG Chapter 8). This madness may cause wasted actions, attacks on allies, or the Frightened condition.",
            "ADJUSTED ENCOUNTER: The spectral enemies here no longer have the instant-kill Life Drain. Instead, Wraith hits reduce maximum HP by 1d6 until the target finishes a long rest. Dangerous and accumulating, but not a single-hit death sentence.",
            "The ice walls reflect the fight in fragmented, delayed images — players may see echoes of attacks before they happen. This is flavour only, not a mechanical advantage.",
          ],
          dmNote: "This is the most psychologically taxing room in the pass. The madness effects are the real danger — a party member burning all their spell slots on nothing, or attacking an ally, can cascade into the Chimera fight above going catastrophically wrong. Let the wrongness of the reflections breathe before initiative is called. The smile in the reflection should be mentioned once, casually, and never explained.",
        },
        {
          title: "Encounter 2 — The Soul-Collectors",
          type: "encounter",
          content: "The dark shapes in the mirrors step out of the walls. These are the spectral remnants of those who failed the climb before — bound to the cave, driven to claim new souls.",
          creatures: [
            "2 Wraiths (MM p.302) — MODIFIED: Life Drain reduces max HP by 1d6 until long rest, not until death",
            "4 Specters (MM p.279)",
          ],
          tactics: "The Wraiths prioritize any character already suffering from madness — they are easier to isolate. Specters swarm to prevent the party from clustering for healing. The incorporeal movement means melee fighters struggle to pin them. Radiant damage is the key — if any party member has it, they become immediately invaluable. The Guide walks to the far end of the cave and stands at the exit, waiting.",
          dmNote: "If a character's max HP drops to zero via accumulated Life Drain hits, they fall unconscious immediately regardless of current HP. This is the consequence that replaces instant-kill — it takes multiple hits to get there, but it can still happen if a character is focused. Track max HP reductions openly so players feel the pressure building.",
        },
        {
          title: "Part 3 — The Summit Plateau",
          type: "scene",
          content: "Past the cave, the path climbs to a windswept high-altitude plateau. The air is thin. The party is likely battered and low on resources. The Guide stops at the edge of the plateau and waits for them to catch up.",
          keyInfo: [
            "HIGH ALTITUDE: Any character who takes the Dash action becomes Poisoned until the end of their next turn as they gasp for thin air.",
            "The plateau is wide and open — no cover, no choke points. This favors mobile enemies.",
            "A DC 13 Perception check before crossing detects deep gouges in the snow ahead — something large has been moving here recently.",
          ],
          dmNote: "Let the party make the Perception check organically — if someone says they scout ahead or look around, give it to them. Finding the gouges before the Chimera emerges gives them one round to prepare. If nobody checks, the Chimera erupts from behind a snow-covered boulder mid-crossing. Same fight, different opening beat.",
        },
        {
          title: "Encounter 3 — The Hollowed Chimera (Boss)",
          type: "encounter",
          content: "A grotesque beast reveals itself — a mockery of nature fused with the mountain's corruption. The lion's head is a screaming hollow skull. The goat's head is a mass of writhing purple tentacles. The dragon's head is skeletal white, breathing icy mist.",
          creatures: [
            "1 Hollowed Chimera — use Chimera stat block (MM p.41) with modifications below",
          ],
          tactics: "MODIFICATIONS: Breath weapon deals Cold damage instead of Fire. New Action — Maddening Roar (Recharge 5-6): each creature within 120 feet makes DC 13 Wisdom save or is Frightened for 1 minute (save ends at end of each turn). Combined with High Altitude, the Maddening Roar creates cascading chaos — Frightened characters cannot Dash without the Poisoned condition and must move away from the Chimera, which may push them toward the plateau edge. The Chimera is a bullet sponge. Let it take everything the party has. The Guide walks to the far end of the plateau and stands at the exit. He is the finish line.",
          dmNote: "This fight is designed to be won on empty. The party should be scraping the bottom of their resources when the Chimera finally drops. That exhaustion is the point — Darkon should feel earned. After the Chimera falls, give the party a moment of genuine silence before the Guide turns and gestures them toward the tunnel. He does not acknowledge the fight. He does not acknowledge their condition. He simply indicates: forward.",
        },
        {
          title: "Part 4 — The Darkonian Gate",
          type: "scene",
          content: "The Guide leads the party to the far edge of the plateau and a massive downward-sloping tunnel carved into the mountainside. Darkness below. The city of Darkon at the end of it.",
          boxedText: "The Guide stops at the tunnel mouth. He turns his masked face toward each of you in turn — the same slow assessment as when you first met him at the Iron Gate. Whatever he is measuring, he measures it now. Then he turns and gestures into the darkness. Forward. That is all.",
          keyInfo: [
            "If the party made it through with no deaths, the Guide's final assessment lingers a half-second longer than usual before he gestures forward. That is all. Draw no further attention to it.",
            "If the party suffered a reincarnation, the Guide's assessment is identical. Same duration, same gesture. Same silence. He makes no distinction.",
            "The tunnel descends for nearly an hour before the first faint sounds of the city below begin to filter upward — a low industrial hum, the distant clang of metal.",
            "LEVEL UP: Characters advance to Level 7.",
          ],
          dmNote: "The Guide's identical response to both outcomes is the point. He is not rewarding success or judging failure. He is simply moving them forward. Players who made it through clean may feel cheated by the lack of acknowledgment. Players who lost someone may feel unexpectedly relieved. Both reactions are correct. Do not explain the Guide. Do not humanize him. Forward.",
        },
      ],
    }

export default chapter

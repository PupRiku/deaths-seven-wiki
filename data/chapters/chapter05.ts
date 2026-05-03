import type { Chapter } from "@/types"

const chapter: Chapter = {
      number: 5,
      act: 1 as const,
      title: "The City of Chains",
      levelStart: 7,
      levelEnd: 7,
      summary: "The party descends into Darkon on a massive cargo lift and is immediately designated Contaminants by Manikin soldiers. They are marched through a city that is stranger and richer than they expected — glimpsing a Hunt in progress, a beautiful Scion machine, and the quiet weight of Church control over daily life — before being interrogated by Director Valerius. Three possible gambits determine how they navigate her, but all roads lead to Lord Inquisitor Varrus at the Grand Cathedral, who lets something slip about the Scourge that the Church would not want said aloud. Then the door closes and Albinus stops stammering.",
      sections: [
        {
          title: "The Descent",
          type: "scene",
          content: "The party steps from the Iron Pass tunnel onto a high cliff platform where a massive, ancient cargo lift awaits. As they pull the lever, the machine groans to life and begins its long slow descent toward the city below.",
          boxedText: "The wind of the pass dies the moment the lift begins to move. What replaces it is the city's own sound — a low industrial hum, punctuated by the distant clang of steel on stone. Below you, Darkon spreads out across the valley floor: a sprawling gothic nightmare of black stone, sharp spires, and cramped shadowed rooftops packed so tightly together they seem to be holding each other up. You see no citizens. The streets are empty. Two beacons burn in the darkness — a massive, brilliantly lit cathedral on the far side of the city, and a district of iron towers glowing with cold blue-white light closer to you. Your lift is heading for the blue light. It slams into a steel-plated platform at the base of the city wall. Four figures are waiting.",
          dmNote: "The empty streets are because the 34th Hunt is in progress — the party does not know this yet. Let the silence register. A city this large should not be this quiet. The two beacons establish the faction geography immediately. Players who researched Darkon in the archives will recognize both.",
        },
        {
          title: "The Manikin Welcome",
          type: "scene",
          content: "Four Manikins — articulated skeletal frames of iron and bronze with a single glowing blue lens where a face should be — move to flank the party the moment they step off the lift.",
          boxedText: "The Captain's voice is a synthesized emotionless monotone that echoes off the walls. 'HALT. THE LIFT HAS REACHED TERMINUS. DO NOT PROCEED. BY ORDER OF THE RADIANT CHURCH AND THE SCION DIRECTORATE, THE CITY OF DARKON IS UNDER PERMANENT LOCKDOWN. ORDER THIRTY-FOUR. YOUR PRESENCE IS UNSANCTIONED. YOUR PURPOSE IS UNKNOWN. YOU ARE DESIGNATED... CONTAMINANT. YOU WILL SURRENDER YOUR WEAPONS AND ALL ARTIFACTS. YOU WILL BE ESCORTED TO THE NEW BRIDGE DISTRICT FOR INTERROGATION. REFUSAL WILL BE DESIGNATED HOSTILE ACTION. REFUSAL WILL BE MET WITH TERMINATION.'",
          keyInfo: [
            "The Manikins efficiently disarm the party — weapons, spell components, the Relic Stone. Everything is catalogued and crated.",
            "Combat is possible but catastrophically inadvisable. DC 14 Insight on the Captain confirms it is not bluffing.",
            "Fizzle is designated a biological anomaly and placed in a small ventilated container. She is furious. She is also quietly terrified.",
            "The party is marched as prisoners into the New Bridge District.",
          ],
          dmNote: "The Manikins are not cruel — they are procedural. They will answer direct yes/no questions about the process but nothing else. Their absolute procedural calm is more unsettling than aggression would be.",
        },
        {
          title: "City Window 1 — The Hunt",
          type: "scene",
          content: "As the party is marched toward the New Bridge, they pass through a wide intersection. The Captain raises a fist. The escort stops. Waits.",
          boxedText: "Something comes around the corner at speed. It was a man once. Now his spine arches the wrong way and his hands drag along the ground as he runs, knuckles sparking on the cobblestones. His jaw has distended. His eyes are gold. He does not seem to notice you. He is running from something. A moment later, that something follows — three figures in dark leather armour moving in absolute silence, closing the distance with the patient efficiency of people who have done this many times before. They do not look at you either. The intersection empties. The Captain lowers his fist. 'PROCEED.'",
          keyInfo: [
            "This is the 34th Hunt — a Scourge outbreak response. The Jaegers pursuing the afflicted are Obitus operatives, deliberately unmarked.",
            "DC 13 Perception: the leather armour bears no insignia.",
            "DC 15 Medicine: the afflicted man's transformation is recent — hours, not days. The Scourge moves fast.",
            "The Captain states only: 'ORDER THIRTY-FOUR PROCEDURES ARE IN EFFECT. FURTHER INQUIRY IS NON-PRODUCTIVE.'",
          ],
          dmNote: "This window plants three seeds — the Scourge is real and visible, the Jaegers operate in the open, and the population is hiding indoors because they know what a Hunt looks like. Do not explain anything.",
        },
        {
          title: "City Window 2 — The Scion Machine",
          type: "scene",
          content: "Through a gap between two iron towers, the party sees something that stops them mid-step.",
          boxedText: "Between the towers, suspended on cables above the street, is a machine the size of a house. Brass and crystal and something that looks like frozen light. It rotates slowly, silently, each facet catching the arc-lamp glow and throwing prismatic patterns across the wet cobblestones below. It serves no obvious purpose. It is simply there, turning in the dark, and it is one of the most beautiful things you have seen since you woke up in that field. A Scion engineer stands below it, looking up with the expression of someone watching a child sleep.",
          keyInfo: [
            "This is a Resonance Collector — harvests ambient magical energy for the district's arc-lamps.",
            "DC 14 Arcana: the crystal facets are tuned to specific magical frequencies.",
            "The engineer does not acknowledge the party. She is entirely absorbed.",
            "This window exists to establish that Darkon is not only a nightmare — extraordinary things are made here by people who care deeply about their work.",
          ],
          dmNote: "This is the window that makes players want to come back. The machine is beautiful and inexplicable and nobody explains it. If a player asks the Captain what it is, it states the full technical designation and continues marching.",
        },
        {
          title: "Director Valerius — The Interrogation",
          type: "scene",
          content: "The party is brought to the top floor of the Scions' Fortress. Director Valerius is already at her desk. She does not look up immediately.",
          boxedText: "'Contaminants. From the forbidden pass. Claiming a divine imperative. And a pixie in a box.' She sets down the report. 'How quaint. You have two options. You can be processed — and your bodies given to our research division. Or you can tell me, precisely, who you are, why you are here, and most importantly, what the Obitus Scholare wants with that stone.'",
          keyInfo: [
            "Valerius is not hostile — she is analytical. She wants information and the party to believe she holds all the cards. She mostly does.",
            "DC 15 Insight: she is more interested in the Relic Stone than the party. They are a delivery mechanism.",
            "DC 18 Insight: she already suspects Voss is operating outside the city. The party's arrival has accelerated a timeline she was already working.",
          ],
          dmNote: "Valerius rewards players who engage on her own terms — precision, utility, lack of sentimentality. Neither intimidation nor charm works on her. Pragmatism opens doors.",
        },
        {
          title: "The Three Gambits",
          type: "scene",
          content: "The party has three viable approaches to Valerius. Each leads to the same destination — the Grand Cathedral — via different paths with different consequences.",
          keyInfo: [
            "GAMBIT 1 — THE KEY GAMBIT: Claim the stone is biometrically locked to them. DC 14 Deception or DC 13 Arcana. SUCCESS: Valerius sees them as components. She re-arms them and personally escorts them to the Cathedral as a political power play. The party walks in armed with a powerful ally.",
            "GAMBIT 2 — THE UNSTABLE GAMBIT: Fizzle claims the stone is dangerously unstable — a magical bomb only they can handle. DC 13 Performance or Deception. SUCCESS: Valerius wants the hazard out of her district. The party is marched to the Cathedral as hazardous materials — faster, less scrutiny, but disarmed.",
            "GAMBIT 3 — THE BUSINESS GAMBIT: Reframe as clients and the Obitus as manufacturers. DC 15 Persuasion. SUCCESS: Valerius confiscates the stone for her own R&D and holds the party as guests. COMPLICATION: They must steal the stone back from her secured lab. DC 16 Sleight of Hand or Thieves' Tools during a Hunt incident window. Reward: they also find Voss's personnel file — first concrete lead on her.",
          ],
          dmNote: "All three gambits reach Varrus then Albinus. Gambit 1 — armed, escorted, political weight. Gambit 2 — disarmed, arrives as a problem, Varrus has more leverage. Gambit 3 — delayed, but the Voss file gives an intelligence advantage in Chapter 7. No gambit is wrong.",
        },
        {
          title: "City Window 3 — The Church's Reach",
          type: "scene",
          content: "En route to the Grand Cathedral the party passes through the transition zone between the Scion district and the Cathedral quarter. The city changes.",
          boxedText: "The arc-lamps end at a precise line, as if the light itself has been instructed not to cross. On the other side, streets are lit by candles in iron sconces. The buildings here are older, heavier. Every doorway has a small iron ward above it — a stylised eye, open. The people move with heads down and measured steps. On a corner, a small girl of perhaps seven is pressing a fresh ward above a door while her mother holds the candle. The girl looks up as you pass. She looks at Fizzle's container. Then she looks away quickly and goes back to her work.",
          keyInfo: [
            "The iron wards are both religious symbols and surveillance tools — DC 14 Arcana reveals a faint enchantment registering magical auras passing beneath.",
            "The Church knows the party is in this district the moment they cross the line. Varrus is already informed.",
          ],
          dmNote: "This window is quieter than the others. The Hunt was violence, the machine was wonder — this is the slow daily weight of living under something that watches. Let it be uncomfortable without being preachy.",
        },
        {
          title: "Lord Inquisitor Varrus",
          type: "scene",
          content: "The party is brought to the Pillar of Blood. Varrus receives them in a vaulted chamber that smells of incense and old stone.",
          boxedText: "'In a sane world, I would have you all purified by fire. You are heretics. You carry a heretical artifact.' He pauses. 'But the High-Apostles have decreed the Obitus Scholare a necessary filth. So I will send for their local agent. He will claim his property. And then you will be his problem.' He turns away. Then, almost to himself: 'Though I sometimes wonder if the Scholare's filth and the Scourge's filth are not the same filth, differently named.'",
          keyInfo: [
            "THE SLIP: That last line is not accidental. DC 12 Insight confirms he said more than he intended.",
            "If pressed carefully: 'The Church teaches the Scourge is divine punishment for the sins of the old regime. I have read those records. I know what they were experimenting with in the Asylum. The timing is... theologically inconvenient.' He will say nothing further.",
            "THE TRUTH: The Scourge is not divine punishment. It is a leaked Obitus experiment — a blood-infusion process that went wrong and became contagious. The Church knows. The suppression of this truth holds the theocracy together.",
            "Varrus suspects Albinus. He has no proof. He signs the writ anyway.",
          ],
          dmNote: "Varrus is a true believer who found the crack in his own faith and is desperately mortaring over it. His disgust at the party is real. His slip about the Scourge is also real. Both are simultaneously true. Players who press gently leave with the most important piece of lore in Darkon — the lie the whole city is built on.",
        },
        {
          title: "Brother Albinus",
          type: "scene",
          content: "The party waits in a cell beneath the Pillar of Blood. After several hours, Varrus returns with a thin stoop-shouldered man in Luminary Scribe robes who stammers an apology and signs the transferal writ with trembling inky hands. Then the door closes.",
          boxedText: "The moment the iron bolt slides home, everything changes. The stammer stops. The stoop straightens — fractionally, but enough. The man with the thick spectacles turns and looks at each of you in turn with eyes that are, behind those magnifying lenses, cold and precise and completely unsurprised by anything he sees. 'Right,' he says. His voice is crisp. 'This way. Quickly. And do not speak to anyone.'",
          keyInfo: [
            "Albinus re-arms the party immediately.",
            "'You are no longer prisoners. You are acquisitions. Property of the Luminary Repository, assigned to the Forbidden Lore wing, pending archival. That is your only identity here. My name is Brother Albinus. I am your sole contact. Do not use it in front of anyone.'",
            "He leads them to an extra-dimensional safe room in the Cathedral's library.",
            "The plan: the only way out of the locked-down city is through the sealed Asylum beneath the Cathedral. He will get them access. They go in, find the flooded lower levels, locate the breach into the forgotten sewer line, follow it out under the walls.",
            "'The Asylum is haunted. It is dangerous. It is also the only door nobody is watching, because nobody sane would open it. I will be waiting at the threshold. I will not be going in with you.'",
          ],
          dmNote: "The stammer drop is the whole moment — give it a full beat of silence. Albinus is not an ally. He is a handler. That honesty, paradoxically, makes him more trustworthy than warmth would. He needs them to succeed and will give them what they need — but feels no warmth toward them and will not pretend otherwise.",
        },
      ],
    }

export default chapter
